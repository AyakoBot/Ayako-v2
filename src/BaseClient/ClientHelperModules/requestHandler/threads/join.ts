import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Joins a thread in a guild.
 * @param guild - The guild where the thread is located.
 * @param threadId - The ID of the thread to join.
 * @returns A promise that resolves with the joined thread or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, threadId: string) =>
 (cache.apis.get(guild.id) ?? API).threads.join(threadId).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
