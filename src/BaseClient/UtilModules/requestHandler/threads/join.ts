import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Joins a thread in a guild.
 * @param guild - The guild where the thread is located.
 * @param thread - The thread to join.
 * @returns A promise that resolves with the joined thread or rejects with a DiscordAPIError.
 */
export default async (thread: Discord.ThreadChannel) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canJoin(thread)) {
  const e = thread.client.util.requestHandlerError(
   `Cannot join thread ${thread.name} / ${thread.id} in ${thread.guild.name} / ${thread.guild.id}`,
   [Discord.PermissionFlagsBits.SendMessages],
  );

  thread.client.util.error(thread.guild, e);
  return e;
 }

 return (
  thread.client.util.cache.apis.get(thread.guild.id) ?? new DiscordCore.API(thread.client.rest)
 ).threads
  .join(thread.id)
  .catch((e) => {
   thread.client.util.error(thread.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the permission to join threads.
 * @param thread - The thread channel.
 * @returns A boolean indicating whether the guild member can join threads.
 */
export const canJoin = (thread: Discord.ThreadChannel) => !thread.archived;
