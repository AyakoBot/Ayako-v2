import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Returns the application role connection for the given application ID in the specified guild.
 * If the guild has an API cache, it will be used, otherwise the default API will be used.
 * @param guild - The guild to get the application role connection from.
 * @param applicationId - The ID of the application to get the role connection for.
 * @returns A promise that resolves to the application role connection,
 * or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, applicationId: string) =>
 (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).users
  .getApplicationRoleConnection(applicationId)
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
