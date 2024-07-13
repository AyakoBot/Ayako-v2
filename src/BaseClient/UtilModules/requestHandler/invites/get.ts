import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';
import { RawInviteData } from 'discord.js/typings/rawDataTypes.js';

/**
 * Retrieves an invite for a guild with the given code and optional query parameters.
 * @param guild - The guild to retrieve the invite for.
 * @param code - The code of the invite to retrieve.
 * @param query - Optional query parameters to include in the request.
 * @returns A Promise that resolves with the retrieved invite, or rejects with an error.
 */
export default async <T extends Discord.Guild | null>(
 guild: T,
 code: string,
 query?: Discord.RESTGetAPIInviteQuery,
 client?: T extends null ? Discord.Client<true> : undefined,
) =>
 guild?.invites.cache.get(code) ??
 ((guild ? cache.apis.get(guild.id) : API) ?? API).invites
  .get(code, query)
  .then((i) => {
   const parsed = new Classes.Invite((guild?.client ?? client)!, i as RawInviteData);
   if (guild?.invites.cache.get(parsed.code)) return parsed;
   guild?.invites.cache.set(parsed.code, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
