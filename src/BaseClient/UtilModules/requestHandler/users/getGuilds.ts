import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import error from '../../error.js';

/**
 * Returns the guilds for the current user.
 * @param guild The guild object.
 * @param query Optional query parameters for the API request.
 * @returns A promise that resolves with the guilds for the current user,
 * or rejects with a DiscordAPIError.
 */
async function fn(
 guild: undefined | null | Discord.Guild,
 query?: Discord.RESTGetAPICurrentUserGuildsQuery,
): Promise<Discord.RESTGetAPICurrentUserGuildsResult | Discord.DiscordAPIError> {
 return ((guild ? cache.apis.get(guild.id) : undefined) ?? API).users
  .getGuilds(query)
  .catch((e) => {
   error(guild, e);
   return e as Discord.DiscordAPIError;
  });
}

export default fn;
