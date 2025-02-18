import * as Discord from 'discord.js';
// eslint-disable-next-line import/extensions
import type { RawInviteData } from 'discord.js/typings/rawDataTypes.js';
import * as Classes from '../../../Other/classes.js';
import { getAPI } from '../channels/addReaction.js';

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
 (await getAPI(guild)).invites
  .get(code, query)
  .then((i) => {
   const parsed = new Classes.Invite((guild?.client ?? client)!, i as RawInviteData);

   const g = parsed.guild
    ? (guild?.client || client)?.guilds.cache.get(parsed.guild.id)
    : undefined;

   if (g?.invites.cache.get(parsed.code)) return parsed;
   g?.invites.cache.set(parsed.code, parsed);
   return parsed;
  })
  .catch((e: Discord.DiscordAPIError) => e);
