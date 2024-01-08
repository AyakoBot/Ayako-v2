import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves an invite for a guild with the given code and optional query parameters.
 * @param guild - The guild to retrieve the invite for.
 * @param code - The code of the invite to retrieve.
 * @param query - Optional query parameters to include in the request.
 * @returns A Promise that resolves with the retrieved invite, or rejects with an error.
 */
export default async (guild: Discord.Guild, code: string, query?: Discord.RESTGetAPIInviteQuery) =>
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
