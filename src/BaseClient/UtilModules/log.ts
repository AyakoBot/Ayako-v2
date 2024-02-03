import * as Discord from 'discord.js';
import type * as CT from '../../Typings/Typings.js';

/**
 * Logs a moderation action in the modlog channel(s) of a guild.
 * @param guild The guild where the moderation action was performed.
 * @param type The type of moderation action that was performed.
 * @param target The user who was targeted by the moderation action.
 * @param executor The user who executed the moderation action.
 * @param options Additional options for the moderation action.
 * @returns A Promise that resolves when the log has been sent.
 */
export default async <T extends CT.ModTypes>(
 guild: Discord.Guild,
 type: T,
 target: Discord.User,
 executor: Discord.User,
 options: CT.ModOptions<T>,
): Promise<void> => {
 const logchannels = await guild.client.util.getLogChannels('modlog', guild);
 if (!logchannels) return;

 const language = await guild.client.util.getLanguage(guild.id);
 const lan = language.mod.logs[type as keyof typeof language.mod.logs];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.author,
  },
  description: lan.description(target, executor, options as never),
  color: guild.client.util.CT.ModColors[type],
  timestamp: new Date().toISOString(),
  fields: [
   options.reason
    ? {
       name: language.t.Reason,
       value: options.reason,
      }
    : undefined,
  ].filter((f): f is Discord.APIEmbedField => !!f),
 };

 guild.client.util.send({ guildId: guild.id, id: logchannels }, { embeds: [embed] }, 10000);
};
