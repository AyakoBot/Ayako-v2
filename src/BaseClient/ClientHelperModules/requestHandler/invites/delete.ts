import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Deletes an invite for the given guild and code.
 * @param guild - The guild where the invite is created.
 * @param code - The code of the invite to delete.
 * @param reason - The reason for deleting the invite.
 * @returns A promise that resolves with the deleted invite or rejects with a DiscordAPIError.
 */
export default (guild: Discord.Guild, code: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).invites.delete(code, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
