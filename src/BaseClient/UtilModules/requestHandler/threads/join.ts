import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

import requestHandlerError from '../../requestHandlerError.js';

/**
 * Joins a thread in a guild.
 * @param guild - The guild where the thread is located.
 * @param thread - The thread to join.
 * @returns A promise that resolves with the joined thread or rejects with a DiscordAPIError.
 */
export default async (thread: Discord.ThreadChannel) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canJoin(thread)) {
  const e = requestHandlerError(
   `Cannot join thread ${thread.name} / ${thread.id} in ${thread.guild.name} / ${thread.guild.id}`,
   [Discord.PermissionFlagsBits.SendMessages],
  );

  error(thread.guild, e);
  return e;
 }

 return (cache.apis.get(thread.guild.id) ?? API).threads.join(thread.id).catch((e) => {
  error(thread.guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
};

/**
 * Checks if the given guild member has the permission to join threads.
 * @param thread - The thread channel.
 * @returns A boolean indicating whether the guild member can join threads.
 */
export const canJoin = (thread: Discord.ThreadChannel) => !thread.archived;
