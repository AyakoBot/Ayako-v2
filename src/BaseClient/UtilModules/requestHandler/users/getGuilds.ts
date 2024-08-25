import * as Discord from 'discord.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

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
 return (await getAPI(guild)).users.getGuilds(query).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
}

export default fn;
