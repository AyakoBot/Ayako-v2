import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';

/**
 * Returns the guilds for the current user.
 * @param guild The guild object.
 * @param query Optional query parameters for the API request.
 * @returns A promise that resolves with the guilds for the current user,
 * or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, query?: Discord.RESTGetAPICurrentUserGuildsQuery) =>
 (cache.apis.get(guild.id) ?? API).users.getGuilds(query).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
