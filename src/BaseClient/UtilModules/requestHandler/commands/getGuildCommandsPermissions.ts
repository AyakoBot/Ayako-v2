import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Retrieves the permissions for all the slash commands in a guild.
 * @param guild - The guild to retrieve the permissions for.
 * @returns A promise that resolves to the permissions for all the slash commands in the guild.
 */
export default async (guild: Discord.Guild) =>
 (
  guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)
 ).applicationCommands
  .getGuildCommandsPermissions(await guild.client.util.getBotIdFromGuild(guild), guild.id)
  .then((res) => {
   res.forEach((r) => {
    guild.client.util.cache.commandPermissions.set(guild.id, r.id, r.permissions);
    return r.permissions;
   });

   return res;
  })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
