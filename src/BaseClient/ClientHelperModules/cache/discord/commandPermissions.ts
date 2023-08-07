import * as Discord from 'discord.js';

export interface CommandPermissions {
 get: (
  guildId: string,
  commandId: string,
 ) => Promise<Discord.ApplicationCommandPermissions[] | undefined>;
 set: (
  guildId: string,
  commandId: string,
  permissions: Discord.ApplicationCommandPermissions[],
 ) => void;
 delete: (guildId: string, commandId: string) => void;
 cache: Map<string, Map<string, Discord.ApplicationCommandPermissions[]>>;
}

const self: CommandPermissions = {
 get: async (guildId, commandId) => {
  const cached = self.cache.get(guildId)?.get(commandId);
  if (cached) return cached;

  const client = (await import('../../../Client.js')).default;
  const fetched = await client.application?.commands.permissions.fetch({ guild: guildId });

  self.cache.get(guildId)?.clear();
  fetched?.forEach((f, id) => self.set(guildId, id, f));

  return fetched?.find((_, id) => id === commandId);
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
