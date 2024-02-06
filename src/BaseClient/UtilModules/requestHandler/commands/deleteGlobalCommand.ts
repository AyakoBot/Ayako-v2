import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Deletes a global command from the Discord API and removes it from the cache.
 * @param guild - The guild where the command is registered.
 * @param commandId - The ID of the command to be deleted.
 * @returns A promise that resolves when the command is successfully deleted
 * and removed from the cache,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, commandId: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return (
  guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)
 ).applicationCommands
  .deleteGlobalCommand(await guild.client.util.getBotIdFromGuild(guild), commandId)
  .then(() => {
   guild.client.util.cache.commands.delete(guild.id, commandId);
   guild.client.application.commands.cache.delete(commandId);
  })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
