import * as Discord from 'discord.js';
import cache from './cache.js';
import SlashCommands from '../../SlashCommands/index.js';

type CommandName = (typeof SlashCommands)['names'][number];

/**
 * Retrieves a custom command by name for a specific guild or globally.
 * @param guildId - The ID of the guild to retrieve the command from.
 * If undefined or null, retrieves the global command.
 * @param name - The name of the command to retrieve.
 * @returns The custom command with the specified name, or undefined if it does not exist.
 */
export default async (guild: Discord.Guild | undefined | null, name: CommandName) => {
 const { default: client } = await import('../Bot/Client.js');

 if (guild && !guild.commands.cache.size) {
  await client.util.request.commands.getGuildCommands(guild);
 }

 const clientCommand =
  guild?.commands.cache.find((c) => c.name === name) ??
  client.application?.commands.cache.find((c) => c.name === name);

 return guild
  ? ([...(cache.commands.cache.get(guild.id)?.values() ?? [])]?.find((c) => c.name === name) ??
     clientCommand)
  : clientCommand;
};
