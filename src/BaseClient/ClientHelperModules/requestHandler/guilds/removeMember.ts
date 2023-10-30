import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Removes a member from a guild.
 * @param guild The guild to remove the member from.
 * @param userId The ID of the user to remove.
 * @param reason The reason for removing the member (optional).
 * @returns A promise that resolves with the removed member's data if successful,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default (guild: Discord.Guild, userId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).guilds.removeMember(guild.id, userId, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
