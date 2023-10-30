import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Removes a member from a thread in a guild.
 * @param guild - The guild where the thread is located.
 * @param threadId - The ID of the thread to remove the member from.
 * @param userId - The ID of the user to remove from the thread.
 * @returns A promise that resolves with the removed member's ID if successful,
 * or rejects with a DiscordAPIError if unsuccessful.
 */
export default (guild: Discord.Guild, threadId: string, userId: string) =>
 (cache.apis.get(guild.id) ?? API).threads.removeMember(threadId, userId).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
