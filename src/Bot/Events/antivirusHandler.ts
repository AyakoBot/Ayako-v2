import client from '../BaseClient/DDenoClient.js';
import type CT from '../Typings/CustomTypings';
import type DBT from '../Typings/DataBaseTypings';

let messageCache: bigint[] = [];

export default async (msg: CT.MessageGuild, m?: CT.MessageGuild | null) => {
  if (msg) {
    client.helpers
      .deleteMessage(msg.channelId, msg.id, msg.language.deleteReasons.antivirus)
      .catch(() => null);
  }

  const settingsRow = await getSettings(msg);
  if (!settingsRow) return;

  messageCache.push(msg.author.id);

  await runPunishment(msg, m);

  (await import('./modSourceHandler.js')).default('antivirus', m, settingsRow);
};

export const resetData = () => {
  messageCache = [];
};

const getSettings = async (msg: CT.MessageGuild) =>
  client.ch
    .query('SELECT * FROM antivirus WHERE guildid = $1 AND active = true;', [String(msg.guildId)])
    .then((r: DBT.antivirus[] | null) => (r ? r[0] : null));

const runPunishment = async (msg: CT.MessageGuild, m?: CT.MessageGuild | null) => {
  const amountOfTimes = messageCache.filter((a) => a === msg.author.id).length;
  const punishment = await getPunishment(msg, amountOfTimes);

  const obj: CT.ModBaseEventOptions = {
    type: 'warnAdd',
    executor: client.me,
    target: msg.author,
    msg,
    reason: msg.language.autotypes.antivirus,
    guild: msg.guild,
    source: 'antivirus',
    forceFinish: true,
    m,
  };

  if (!punishment) {
    (await import('./modBaseEvent.js')).default(obj);
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

  (await import('./modBaseEvent.js')).default(obj);
};

const getPunishment = async (msg: CT.MessageGuild, warns: number) =>
  client.ch
    .query(
      `SELECT * FROM antiviruspunishments WHERE guildid = $1 AND warnamount = $2 AND active = true;`,
      [String(msg.guildId), warns],
    )
    .then((r: DBT.BasicPunishmentsTable[] | null) => (r ? r[0] : null));
