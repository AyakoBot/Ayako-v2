import type * as Discord from 'discord.js';
import Discord from 'discord.js';
import type CT from '../../../Typings/CustomTypings';
import type DBT from '../../../Typings/DataBaseTypings';
import client from '../../../BaseClient/Client.js';

let messageCache: bigint[] = [];

export default async (msg: CT.MessageGuild) => {
  if (!msg.content?.length) return;
  if (new Discord.PermissionsBitField(msg.member.permissions).has(8n)) return;

  const settings = await getSettings(msg);
  if (!settings) return;
  if (!settings.words?.length) return;
  if (settings.bpchannelid && settings.bpchannelid.includes(String(msg.channelId))) return;
  if (settings.bpuserid && settings.bpuserid.includes(String(msg.authorId))) return;
  if (
    settings.bproleid &&
    msg.member.roles.some((role) => settings.bproleid?.includes(String(role)))
  ) {
    return;
  }

  const saidWords = settings.words
    ?.map((word) => {
      if (msg.content.toLowerCase().includes(word.toLowerCase())) return word;
      return null;
    })
    .filter((w): w is string => !!w);

  if (!saidWords.length) return;

  client.helpers
    .deleteMessage(msg.channelId, msg.id, msg.language.deleteReasons.deleteBlacklist)
    .catch(() => null);

  softWarn(msg, saidWords, settings);
  messageCache.push(msg.authorId);

  const amount = messageCache.filter((a) => a === msg.author.id).length;
  if (amount === 1) return;

  runPunishment(msg);
};

const runPunishment = async (msg: CT.MessageGuild) => {
  const amountOfTimes = messageCache.filter((a) => a === msg.author.id).length;
  const punishment = await getPunishment(msg, amountOfTimes);

  const obj: CT.ModBaseEventOptions = {
    type: 'warnAdd',
    executor: client.me,
    target: msg.author,
    msg,
    reason: msg.language.autotypes.blacklist,
    guild: msg.guild,
    source: 'blacklist',
    forceFinish: true,
  };

  if (!punishment) {
    (await import('../../modBaseEvent')).default(obj);
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

  (await import('../../modBaseEvent')).default(obj);
};

export const resetData = () => {
  messageCache = [];
};

const softWarn = async (msg: CT.MessageGuild, words: string[], settings: DBT.blacklist) => {
  const embed: Discord.APIEmbed = {
    color: client.customConstants.colors.warning,
    author: {
      icon_url: client.customConstants.standard.error,
      url: client.customConstants.standard.invite,
      name: msg.language.slashCommands.settings.settings.blacklist.authorName,
    },
    description: msg.language.slashCommands.settings.settings.blacklist.description(
      settings.words?.map((w) => `\`${w}\``).join(' | '),
    ),
    fields: [
      {
        name: msg.language.slashCommands.settings.settings.blacklist.field,
        value: `${words.map((w) => `\`${w}\``).join(' | ')}`,
        inline: false,
      },
    ],
  };

  client.ch.send(
    await client.helpers.getDmChannel(msg.authorId),
    { embeds: [embed] },
    msg.language,
  );

  client.ch.send(
    msg.channel,
    {
      content: `<@${msg.authorId}> ${msg.language.mod.warnAdd.blacklist}`,
      allowedMentions: {
        users: [msg.authorId],
      },
    },
    msg.language,
  );
};

const getSettings = async (msg: CT.MessageGuild) =>
  client.ch
    .query(`SELECT * FROM blacklist WHERE guildid = $1 AND active = true;`, [String(msg.guild.id)])
    .then((r: DBT.blacklist[] | null) => (r ? r[0] : null));

const getPunishment = async (msg: CT.MessageGuild, warns: number) =>
  client.ch
    .query(
      `SELECT * FROM blacklistpunishments WHERE guildid = $1 AND warnamount = $2 AND active = true;`,
      [String(msg.guild.id), warns],
    )
    .then((r: DBT.BasicPunishmentsTable[] | null) => (r ? r[0] : null));
