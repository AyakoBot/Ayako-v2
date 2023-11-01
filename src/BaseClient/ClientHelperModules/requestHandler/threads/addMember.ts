import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Adds a member to a thread in a guild.
 * @param guild - The guild where the thread is located.
 * @param threadId - The ID of the thread to add the member to.
 * @param userId - The ID of the user to add to the thread.
 * @returns A promise that resolves with the added member or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, threadId: string, userId: string) =>
 (cache.apis.get(guild.id) ?? API).threads.addMember(threadId, userId).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
