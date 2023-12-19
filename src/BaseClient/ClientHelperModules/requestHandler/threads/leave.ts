import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

import requestHandlerError from '../../requestHandlerError.js';

/**
 * Leaves a thread in a guild.
 * @param guild - The guild where the thread is located.
 * @param threadId - The ID of the thread to leave.
 * @returns A promise that resolves with the DiscordAPIError if an error occurs, otherwise void.
 */
export default async (thread: Discord.ThreadChannel) => {
 if (!canLeave(thread)) {
  const e = requestHandlerError(
   `Cannot leave thread ${thread.id} in ${thread.guild.name} / ${thread.guild.id}`,
   [Discord.PermissionFlagsBits.SendMessages],
  );

  error(thread.guild, e);
  return e;
 }

 return (cache.apis.get(thread.guild.id) ?? API).threads.leave(thread.id).catch((e) => {
  error(thread.guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
};

/**
 * Checks if the given guild member has the permission to leave threads.
 * @param thread - The thread channel.
 * @returns A boolean indicating whether the guild member can leave threads.
 */
export const canLeave = (thread: Discord.ThreadChannel) => !thread.archived;
