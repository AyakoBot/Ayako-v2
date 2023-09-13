import * as Discord from 'discord.js';
import error from '../../error.js';

type ActionType = Discord.GuildAuditLogsEntry<
 Discord.AuditLogEvent,
 Discord.GuildAuditLogsActionType,
 Discord.GuildAuditLogsTargetType,
 Discord.AuditLogEvent
>['action'];

export interface AuditLogs {
 get: (
  guild: Discord.Guild,
  type: ActionType,
 ) => Promise<Discord.GuildAuditLogsEntry[] | undefined>;
 set: (guildId: string, entry: Discord.GuildAuditLogsEntry) => void;
 delete: (guildId: string, type: ActionType) => void;
 cache: Map<string, Map<ActionType, Map<string, Discord.GuildAuditLogsEntry>>>;
}

// eslint-disable-next-line no-promise-executor-return
const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

const self: AuditLogs = {
 get: async (guild, type) => {
  await sleep();

  const cached = self.cache.get(guild.id)?.get(type);
  if (cached) return [...cached.values()];

  // eslint-disable-next-line import/no-cycle
  const requestHandler = (await import('../../requestHandler.js')).request;
  const fetched = await requestHandler.guilds.getAuditLogs(guild, {
   action_type: type,
   limit: 100,
  });
  if ('message' in fetched) {
   error(guild, new Error('Missing Permissions to fetch Audit Logs'));
   return undefined;
  }

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
