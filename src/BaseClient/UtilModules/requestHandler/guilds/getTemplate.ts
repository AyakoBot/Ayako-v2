import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Returns a Promise that resolves with a new GuildTemplate instance for the given guild.
 * If the guild has an API cache, it will use that cache, otherwise it will use the default API.
 * If an error occurs, it will log the error and return the DiscordAPIError.
 * @param guild The guild to get the template for.
 * @returns A Promise that resolves with a new GuildTemplate instance for the given guild.
 */
export default async (guild: Discord.Guild) =>
 (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).guilds
  .getTemplate(guild.id)
  .then((t) => new Classes.GuildTemplate(guild.client, t))
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
