import * as Discord from 'discord.js';
import error from '../../error.js';

/**
 * Interface for managing command permissions for a Discord guild.
 */
export interface CommandPermissions {
 /**
  * Retrieves the command permissions for a given guild and command ID.
  * @param guild The Discord guild to retrieve permissions for.
  * @param commandId The ID of the command to retrieve permissions for.
  * @returns A Promise that resolves to an array of ApplicationCommandPermissions,
  * or undefined if no permissions are found.
  */
 get: (
  guild: Discord.Guild,
  commandId: string,
 ) => Promise<Discord.ApplicationCommandPermissions[] | undefined>;

 /**
  * Sets the command permissions for a given guild and command ID.
  * @param guildId The ID of the guild to set permissions for.
  * @param commandId The ID of the command to set permissions for.
  * @param permissions An array of ApplicationCommandPermissions to set.
  */
 set: (
  guildId: string,
  commandId: string,
  permissions: Discord.ApplicationCommandPermissions[],
 ) => void;

 /**
  * Deletes the command permissions for a given guild and command ID.
  * @param guildId The ID of the guild to delete permissions for.
  * @param commandId The ID of the command to delete permissions for.
  */
 delete: (guildId: string, commandId: string) => void;

 /**
  * A cache of command permissions, keyed by guild ID and then by command ID.
  */
 cache: Map<string, Map<string, Discord.ApplicationCommandPermissions[]>>;
}

const self: CommandPermissions = {
 get: async (guild, commandId) => {
  const cached = self.cache.get(guild.id)?.get(commandId);
  if (cached) return cached;

    const requestHandler = (await import('../../requestHandler.js')).request;
  const fetched = await requestHandler.commands.getGuildCommandsPermissions(guild);
  if ('message' in fetched) {
   error(guild, new Error('Couldnt get Command Permissions'));
   return undefined;
  }

  self.cache.get(guild.id)?.clear();
  fetched?.map((f) =>
   self.set(
    guild.id,
    f.id,
    f.permissions.map((p) => ({ id: p.id, type: p.type, permission: p.permission })),
   ),
  );

  return fetched?.find((f) => f.id === commandId)?.permissions;
 },
 set: (guildId, commandId, permissions) => {
  if (!self.cache.get(guildId)) self.cache.set(guildId, new Map());
  self.cache.get(guildId)?.set(commandId, permissions);
 },
 delete: (guildId, commandId) => {
  if (self.cache.get(guildId)?.size === 1) self.cache.delete(guildId);
  else self.cache.get(guildId)?.delete(commandId);
 },
 cache: new Map(),
};

export default self;
