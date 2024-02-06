import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Returns the current user for the given guild.
 * @param guild - The guild to get the current user for.
 * @returns A promise that resolves with a new instance of the ClientUser class
 * representing the current user, or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild) =>
 (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).users
  .getCurrent()
  .then((u) => new Classes.ClientUser(guild.client, u))
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
