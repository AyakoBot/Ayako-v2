import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Returns the current connections of the users in the specified guild.
 * If the connections cannot be retrieved, logs an error and returns the error object.
 * @param guild - The guild to retrieve the connections for.
 * @returns A promise that resolves to an array of user connections or an error object.
 */
export default async (guild: Discord.Guild) =>
 (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).users
  .getConnections()
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
