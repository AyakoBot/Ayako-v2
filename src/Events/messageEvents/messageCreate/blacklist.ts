import type * as Discord from 'discord.js';
import type CT from '../../../Typings/CustomTypings';
import type DBT from '../../../Typings/DataBaseTypings';
import { ch, client } from '../../../BaseClient/Client.js';

let messageCache: string[] = [];

export default async (msg: Discord.Message) => {
  if (!msg.content?.length) return;
  if (msg.member?.permissions.has(8n)) return;

  const settings = await getSettings(msg);
  if (!settings) return;
  if (!settings.words?.length) return;
  if (settings.wlchannelid && settings.wlchannelid.includes(String(msg.channelId))) return;
  if (settings.wluserid && settings.wluserid.includes(String(msg.author.id))) return;
  if (
    settings.wlroleid &&
    msg.member?.roles.cache.some((role) => settings.wlroleid?.includes(role.id))
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

  msg.delete().catch(() => null);
  softWarn(msg, saidWords, settings);
  messageCache.push(msg.author.id);

  const amount = messageCache.filter((a) => a === msg.author.id).length;
  if (amount === 1) return;

  runPunishment(msg);
};

const runPunishment = async (msg: Discord.Message) => {
  const amountOfTimes = messageCache.filter((a) => a === msg.author.id).length;
  const punishment = await getPunishment(msg, amountOfTimes);
  const language = await ch.languageSelector(msg.guildId);

  if (!msg.inGuild()) return;
  if (!client.user) return;

  const obj: CT.ModBaseEventOptions = {
    type: 'warnAdd',
    executor: client.user,
    target: msg.author,
    msg,
    reason: language.autotypes.blacklist,
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

const softWarn = async (msg: Discord.Message, words: string[], settings: DBT.blacklist) => {
  if (!msg.inGuild()) return;
  const language = await ch.languageSelector(msg.guildId);

  const embed: Discord.APIEmbed = {
    color: ch.constants.colors.danger,
    author: {
      icon_url: ch.constants.standard.error,
      url: ch.constants.standard.invite,
      name: language.slashCommands.settings.categories.blacklist.action.author,
    },
    description: language.slashCommands.settings.categories.blacklist.action.desc(
      settings.words?.map((w) => `\`${w}\``).join(' | ') as string,
    ),
    fields: [
      {
        name: language.slashCommands.settings.categories.blacklist.action.field,
        value: `${words.map((w) => `\`${w}\``).join(' | ')}`,
        inline: false,
      },
    ],
  };

  const dmChannel = await msg.author.createDM();
  if (dmChannel) ch.send(dmChannel, { embeds: [embed] });

  ch.send(msg.channel, {
    content: `<@${msg.author.id}> ${language.mod.warnAdd.blacklist}`,
    allowedMentions: {
      users: [msg.author.id],
    },
  });
};

const getSettings = async (msg: Discord.Message) =>
  ch
    .query(`SELECT * FROM blacklist WHERE guildid = $1 AND active = true;`, [String(msg.guildId)])
    .then((r: DBT.blacklist[] | null) => (r ? r[0] : null));

const getPunishment = async (msg: Discord.Message, warns: number) =>
  ch
    .query(
      `SELECT * FROM blacklistpunishments WHERE guildid = $1 AND warnamount = $2 AND active = true;`,
      [String(msg.guildId), warns],
    )
    .then((r: DBT.BasicPunishmentsTable[] | null) => (r ? r[0] : null));
