import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

/**
 * Retrieves an invite for a guild with the given code and optional query parameters.
 * @param guild - The guild to retrieve the invite for.
 * @param code - The code of the invite to retrieve.
 * @param query - Optional query parameters to include in the request.
 * @returns A Promise that resolves with the retrieved invite, or rejects with an error.
 */
const get = async (guild: Discord.Guild, code: string, query?: Discord.RESTGetAPIInviteQuery) =>
 guild.invites.cache.get(code) ??
 (cache.apis.get(guild.id) ?? API).invites
  .get(code, query)
  .then((i) => {
   const parsed = new Classes.Invite(guild.client, i);
   if (guild.invites.cache.get(parsed.code)) return parsed;
   guild.invites.cache.set(parsed.code, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Deletes an invite for the given guild and code.
 * @param guild - The guild where the invite is created.
 * @param code - The code of the invite to delete.
 * @param reason - The reason for deleting the invite.
 * @returns A promise that resolves with the deleted invite or rejects with a DiscordAPIError.
 */
const del = (guild: Discord.Guild, code: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).invites.delete(code, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Object containing methods for handling invites.
 * @property {Function} get
 * - Method for getting an invite.
 * @property {Function} delete
 * - Method for deleting an invite.
 */
export default {
 get,
 delete: del,
};
