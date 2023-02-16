import Discord from 'discord.js';
import { ch, client } from '../../../BaseClient/Client.js';
import type DBT from '../../../Typings/DataBaseTypings';
import type CT from '../../../Typings/CustomTypings';

let messageCache: {
  content: string;
  author: string;
  time: number;
}[] = [];

let authorCache: string[] = [];

export default async (msg: Discord.Message) => {
  if (msg.author.id === client.user?.id) return;
  if (msg.author.bot) return;
  if (msg.editedTimestamp) return;

  const stats = await ch
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
    (antispam.wluserid && antispam.wluserid.includes(msg.author.id)) ||
    (antispam.wlroleid &&
      msg.member.roles.cache.some((role) => antispam.wlroleid?.includes(role.id)))
  ) {
    return;
  }

  const me = client.user ? await msg.guild?.members.fetch(client.user.id) : undefined;
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
    !authorCache.includes(msg.author.id)
  ) {
    softwarn(msg);
    authorCache.push(msg.author.id);
    return;
  }

  if (
    dupeMatches.length < Number(antispam.dupemsgthreshold) &&
    normalMatches.length < Number(antispam.msgthreshold)
  ) {
    return;
  }

  authorCache.push(msg.author.id);

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

const runPunishment = async (msg: Discord.Message) => {
  if (!msg.inGuild()) return;

  const allPunishments = authorCache.filter((a) => a === msg.author.id).length;
  const punishment = await getPunishment(msg, allPunishments);
  const language = await ch.languageSelector(msg.guildId);

  if (!client.user) return;

  const obj: CT.ModBaseEventOptions = {
    type: 'warnAdd',
    executor: client.user,
    target: msg.author,
    msg,
    reason: language.autotypes.antispam,
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

const getPunishment = async (msg: Discord.Message, warns: number) =>
  ch
    .query(
      `SELECT * FROM antispampunishments WHERE guildid = $1 AND warnamount = $2 AND active = true;`,
      [String(msg.guildId), warns],
    )
    .then((r: DBT.BasicPunishmentsTable[] | null) => (r ? r[0] : null));

const deleteMessages = async (msg: Discord.Message, matches: number, antispam: DBT.antispam) => {
  if (!antispam.deletespam) return;

  const msgs = await msg.channel.messages.fetch({ limit: 100 }).catch(() => null);
  if (!msgs) return;

  const delMsgs = (msgs as Discord.Collection<string, Discord.Message<true>>)
    .filter((m) => m.author.id === msg.author.id)
    .map((m) => m)
    .slice(0, matches)
    .map((m) => m.id);

  if ('bulkDelete' in msg.channel) msg.channel.bulkDelete(delMsgs).catch(() => null);
};

export const resetData = () => {
  authorCache = [];
  messageCache = [];
};

const softwarn = async (msg: Discord.Message) => {
  const language = await ch.languageSelector(msg.guildId);

  ch.send(msg.channel, {
    content: `<@${msg.author.id}> ${language.mod.warnAdd.antispam}`,
    allowedMentions: {
      users: [msg.author.id],
    },
  });
};

const getSettings = async (msg: Discord.Message) =>
  ch
    .query(
      'SELECT * FROM antispam WHERE guildid = $1 AND active = true AND forcedisabled = false;',
      [String(msg.guildId)],
    )
    .then((r: DBT.antispam[] | null) => (r ? r[0] : null));
