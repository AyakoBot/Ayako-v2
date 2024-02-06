import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Deletes a guild command from the Discord API and removes it from the guild's command cache.
 * @param guild The guild where the command is located.
 * @param commandId The ID of the command to be deleted.
 * @returns A promise that resolves when the command is successfully deleted,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, commandId: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return (
  guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)
 ).applicationCommands
  .deleteGuildCommand(await guild.client.util.getBotIdFromGuild(guild), guild.id, commandId)
  .then(() => {
   guild.client.util.cache.commands.delete(guild.id, commandId);
   guild.commands.cache.delete(commandId);
  })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
