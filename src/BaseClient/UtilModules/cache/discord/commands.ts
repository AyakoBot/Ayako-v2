import * as Discord from 'discord.js';

/**
 * Interface for managing commands for a Discord guild.
 */
export interface Commands {
 /**
  * Retrieves the commands for a given guild and command ID.
  * @param guild The Discord guild to retrieves for.
  * @param commandId The ID of the command to retrieves for.
  * @returns A Promise that resolves to an array of ApplicationCommands,
  * or undefined if no commands are found.
  */
 get: (guild: Discord.Guild, commandId: string) => Promise<Discord.ApplicationCommand | undefined>;

 /**
  * Sets the command s for a given guild and command ID.
  * @param guildId The ID of the guild to sets for.
  * @param commandId The ID of the command to sets for.
  * @param command An array of ApplicationCommands to set.
  */
 set: (guildId: string, commandId: string, command: Discord.ApplicationCommand) => void;

 /**
  * Deletes the commands for a given guild and command ID.
  * @param guildId The ID of the guild to deletes for.
  * @param commandId The ID of the command to deletes for.
  */
 delete: (guildId: string, commandId: string) => void;

 /**
  * A cache of commands, keyed by guild ID and then by command ID.
  */
 cache: Map<string, Map<string, Discord.ApplicationCommand>>;
}

const self: Commands = {
 get: async (guild, commandId) => {
  const cached = self.cache.get(guild.id)?.get(commandId);
  if (cached) return cached;

  const requestHandler =
   guild.client.util.files['/BaseClient/UtilModules/requestHandler.js'].request;
  const fetched = await requestHandler.commands.getGuildCommands(guild);
  if ('message' in fetched) return undefined;

  return fetched?.find((f) => f.id === commandId);
 },
 set: (guildId, commandId, command) => {
  if (!self.cache.get(guildId)) self.cache.set(guildId, new Map());
  self.cache.get(guildId)?.set(commandId, command);
 },
 delete: (guildId, commandId) => {
  if (self.cache.get(guildId)?.size === 1) self.cache.delete(guildId);
  else self.cache.get(guildId)?.delete(commandId);
 },
 cache: new Map(),
};

export default self;
