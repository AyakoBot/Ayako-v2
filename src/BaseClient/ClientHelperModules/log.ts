import * as Discord from 'discord.js';
import * as CT from '../../Typings/CustomTypings.js';
import getLogChannels from './getLogChannels.js';
import languageSelector from './languageSelector.js';
import constants from '../Other/constants.js';
import send from './send.js';

export default async <T extends CT.ModTypes>(
 guild: Discord.Guild,
 type: T,
 target: Discord.User,
 executor: Discord.User,
 options: CT.ModOptions<T>,
): Promise<void> => {
 const logchannels = await getLogChannels('modlog', guild);
 if (!logchannels) return;

 const language = await languageSelector(guild.id);
 const lan = language.mod.logs[type as keyof typeof language.mod.logs];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.author,
  },
  description: lan.description(target, executor, options as never),
  color: constants.colors[constants.modColors[type]],
  timestamp: new Date().toISOString(),
  fields: [
   options.reason
    ? {
       name: language.reason,
       value: options.reason,
      }
    : undefined,
  ].filter((f): f is Discord.APIEmbedField => !!f),
 };

 send({ guildId: guild.id, id: logchannels }, { embeds: [embed] }, undefined, 10000);
};
