import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Bans a user from a guild.
 * @param guild The guild to ban the user from.
 * @param userId The ID of the user to ban.
 * @param body Optional request body to send.
 * @param reason Reason for banning the user.
 * @returns A promise that resolves with the DiscordAPIError if the request fails, otherwise void.
 */
export default (
 guild: Discord.Guild,
 userId: string,
 body?: Discord.RESTPutAPIGuildBanJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds.banUser(guild.id, userId, body, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
