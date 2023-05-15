import * as Discord from 'discord.js';
import * as ch from '../BaseClient/ClientHelper.js';
import type * as CT from '../Typings/CustomTypings';

export default async (
 guild: Discord.Guild,
 type: keyof CT.Language['mod']['logs'],
 target: Discord.User,
 executor: Discord.User,
 options: { role?: Discord.Role; reason?: string },
): Promise<void> => {
 const logchannels = await ch.getLogChannels('modlog', guild);
 if (!logchannels?.length) return;

 const language = await ch.languageSelector(guild.id);
 const lan = language.mod.logs[type];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.author,
  },
  description: lan.description(target, executor, options as never),
  color: ch.constants.colors[ch.constants.modColors[type]],
  timestamp: String(Date.now()),
  fields: [
   options.reason
    ? {
       name: language.reason,
       value: options.reason,
      }
    : undefined,
  ].filter((f): f is Discord.APIEmbedField => !!f),
 };

 ch.send({ guildId: guild.id, id: logchannels }, { embeds: [embed] }, undefined, 10000);
};
