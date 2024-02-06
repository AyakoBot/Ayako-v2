import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Returns the guilds for the current user.
 * @param guild The guild object.
 * @param query Optional query parameters for the API request.
 * @returns A promise that resolves with the guilds for the current user,
 * or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, query?: Discord.RESTGetAPICurrentUserGuildsQuery) =>
 (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).users
  .getGuilds(query)
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
