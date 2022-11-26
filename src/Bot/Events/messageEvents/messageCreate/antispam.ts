import Discord from 'discord.js';
import client from '../../../BaseClient/DDenoClient.js';
import type DBT from '../../../Typings/DataBaseTypings';
import type CT from '../../../Typings/CustomTypings';

let messageCache: {
  content: string;
  author: bigint;
  time: number;
}[] = [];

let authorCache: bigint[] = [];

export default async (msg: CT.MessageGuild) => {
  if (msg.authorId === client.id) return;
  if (msg.author.toggles.bot) return;
  if (msg.editedTimestamp) return;

  const stats = await client.ch
    .query('SELECT antispam FROM stats;')
    .then((r: DBT.stats[] | null) => (r ? r[0] : null));
  if (stats?.antispam === false) return;

  const antispam = await getSettings(msg);
  if (!antispam) return;
  if (antispam.forcedisabled) return;

  if (
    !msg.member ||
    new Discord.PermissionsBitField(msg.member.permissions).has(8n) ||
    (antispam.wlchannelid && antispam.wlchannelid.includes(String(msg.channelId))) ||
    (antispam.wluserid && antispam.wluserid.includes(String(msg.authorId))) ||
    (antispam.wlroleid &&
      msg.member.roles.some((role) => antispam.wlroleid?.includes(String(role))))
  ) {
    return;
  }

  const me = await client.cache.members.get(client.id, msg.guildId);
  if (!me) return;

  messageCache.push({
    content: msg.content,
    author: msg.author.id,
    time: Date.now(),
  });

  const dupeMatches = messageCache.filter(
    (m) =>
      m.time > Date.now() - Number(antispam.timeout) &&
      m.content === msg.content &&
      m.author === msg.author.id,
  );

  const normalMatches = messageCache.filter(
    (m) => m.time > Date.now() - Number(antispam.timeout) && m.author === msg.author.id,
  );

  if (
    (dupeMatches.length === Number(antispam.dupemsgthreshold) - 3 ||
      normalMatches.length === Number(antispam.msgthreshold) - 3) &&
    !authorCache.includes(msg.authorId)
  ) {
    softwarn(msg);
    authorCache.push(msg.authorId);
    return;
  }

  if (
    dupeMatches.length < Number(antispam.dupemsgthreshold) &&
    normalMatches.length < Number(antispam.msgthreshold)
  ) {
    return;
  }

  authorCache.push(msg.authorId);

  if (
    (normalMatches.length - Number(antispam.msgthreshold)) % 3 === 0 ||
    (dupeMatches.length - Number(antispam.dupemsgthreshold)) % 3 === 0
  ) {
    deleteMessages(
      msg,
      normalMatches.length > dupeMatches.length ? normalMatches.length : dupeMatches.length,
      antispam,
    );
    runPunishment(msg);
  }
};

const runPunishment = async (msg: CT.MessageGuild) => {
  if (!msg.guild) return;

  const allPunishments = authorCache.filter((a) => a === msg.author.id).length;
  const punishment = await getPunishment(msg, allPunishments);

  const obj: CT.ModBaseEventOptions = {
    type: 'warnAdd',
    executor: client.me,
    target: msg.author,
    msg,
    reason: msg.language.autotypes.antispam,
    guild: msg.guild,
    source: 'antispam',
    forceFinish: true,
  };

  if (!punishment) {
    (await import('../../modBaseEvent.js')).default(obj);
    return;
  }

  obj.duration = Number(punishment.duration);

  switch (punishment.punishment) {
    case 'ban': {
      obj.type = 'banAdd';
      break;
    }
    case 'kick': {
      obj.type = 'kickAdd';
      break;
    }
    case 'tempban': {
      obj.type = 'tempbanAdd';
      break;
    }
    case 'channelban': {
      obj.type = 'channelbanAdd';
      break;
    }
    case 'tempchannelban': {
      obj.type = 'tempchannelbanAdd';
      break;
    }
    case 'tempmute': {
      obj.type = 'tempmuteAdd';
      break;
    }
    default: {
      break;
    }
  }

  (await import('../../modBaseEvent.js')).default(obj);
};

const getPunishment = async (msg: CT.MessageGuild, warns: number) =>
  client.ch
    .query(
      `SELECT * FROM antispampunishments WHERE guildid = $1 AND warnamount = $2 AND active = true;`,
      [String(msg.guildId), warns],
    )
    .then((r: DBT.BasicPunishmentsTable[] | null) => (r ? r[0] : null));

const deleteMessages = async (msg: CT.MessageGuild, matches: number, antispam: DBT.antispam) => {
  if (!antispam.deletespam) return;

  const msgs = await client.helpers.getMessages(msg.channelId, { limit: 100 });
  if (!msgs) return;

  const delMsgs = msgs
    .filter((m) => m.authorId === msg.authorId)
    .map((m) => m)
    .slice(0, matches)
    .map((m) => m.id);

  if (!('deleteMessages' in msg.channel)) return;
  client.helpers
    .deleteMessages(msg.channelId, delMsgs, msg.language.deleteReasons.antispam)
    .catch(() => null);
};

export const resetData = () => {
  authorCache = [];
  messageCache = [];
};

const softwarn = (msg: CT.MessageGuild) => {
  client.ch.send(
    msg.channel,
    {
      content: `<@${msg.authorId}> ${msg.language.mod.warnAdd.antispam}`,
      allowedMentions: {
        users: [msg.author.id],
      },
    },
    msg.language,
  );
};

const getSettings = async (msg: CT.MessageGuild) =>
  client.ch
    .query(
      'SELECT * FROM antispam WHERE guildid = $1 AND active = true AND forcedisabled = false;',
      [String(msg.guildId)],
    )
    .then((r: DBT.antispam[] | null) => (r ? r[0] : null));
