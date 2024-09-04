import * as Discord from 'discord.js';
import error from '../../error.js';

import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Leaves a thread in a guild.
 * @param guild - The guild where the thread is located.
 * @param thread - The thread to leave.
 * @returns A promise that resolves with the DiscordAPIError if an error occurs, otherwise void.
 */
export default async (thread: Discord.ThreadChannel) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canLeave(thread)) {
  const e = requestHandlerError(
   `Cannot leave thread ${thread.id} in ${thread.guild.name} / ${thread.guild.id}`,
   [Discord.PermissionFlagsBits.SendMessages],
  );

  error(thread.guild, e);
  return e;
 }

 return (await getAPI(thread.guild)).threads
  .leave(thread.id)
  .catch((e: Discord.DiscordAPIError) => {
   error(thread.guild, e);
   return e;
  });
};

/**
 * Checks if the given guild member has the permission to leave threads.
 * @param thread - The thread channel.
 * @returns A boolean indicating whether the guild member can leave threads.
 */
export const canLeave = (thread: Discord.ThreadChannel) => !thread.archived;
