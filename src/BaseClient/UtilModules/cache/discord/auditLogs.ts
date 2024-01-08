import * as Discord from 'discord.js';

type ActionType = Discord.GuildAuditLogsEntry<
 Discord.AuditLogEvent,
 Discord.GuildAuditLogsActionType,
 Discord.GuildAuditLogsTargetType,
 Discord.AuditLogEvent
>['action'];

/**
 * Interface for managing audit logs in a Discord guild.
 */
export interface AuditLogs {
 /**
  * Retrieves the audit logs for a specific guild and action type.
  * @param guild - The guild to retrieve audit logs for.
  * @param type - The type of action to retrieve audit logs for.
  * @returns A promise that resolves to an array of guild audit log entries,
  * or undefined if no entries were found.
  */
 get: (
  guild: Discord.Guild,
  type: ActionType,
 ) => Promise<Discord.GuildAuditLogsEntry[] | undefined>;

 /**
  * Adds a new audit log entry to the cache for a specific guild.
  * @param guildId - The ID of the guild to add the audit log entry for.
  * @param entry - The audit log entry to add to the cache.
  */
 set: (guildId: string, entry: Discord.GuildAuditLogsEntry) => void;

 /**
  * Removes all audit log entries of a specific type from the cache for a specific guild.
  * @param guildId - The ID of the guild to remove the audit log entries from.
  * @param type - The type of audit log entries to remove.
  */
 delete: (guildId: string, type: ActionType) => void;

 /**
  * The cache of audit log entries, organized by guild ID, action type, and entry ID.
  */
 cache: Map<string, Map<ActionType, Map<string, Discord.GuildAuditLogsEntry>>>;
}

const self: AuditLogs = {
 get: async (guild, type) => {
  const cached = self.cache.get(guild.id)?.get(type);
  if (cached) return [...cached.values()];

  const requestHandler = (await import('../../requestHandler.js')).request;
  const fetched = await requestHandler.guilds.getAuditLogs(guild, {
   action_type: type,
   limit: 100,
  });
  if ('message' in fetched) return undefined;

  fetched?.entries.forEach((entry) => self.set(guild.id, entry));
  return fetched?.entries.map((o) => o);
 },
 set: (guildId, entry) => {
  if (!self.cache.get(guildId)) self.cache.set(guildId, new Map());
  if (!self.cache.get(guildId)?.get(entry.action)) {
   self.cache.get(guildId)?.set(entry.action, new Map());
  }
  self.cache.get(guildId)?.get(entry.action)?.set(entry.id, entry);
 },
 delete: (guildId, type) => {
  if (self.cache.get(guildId)?.size === 1) self.cache.delete(guildId);
  else self.cache.get(guildId)?.delete(type);
 },
 cache: new Map(),
};

export default self;
