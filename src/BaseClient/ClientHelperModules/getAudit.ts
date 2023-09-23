import type * as Discord from 'discord.js';
import getUnix from './getUnix.js';
import cache from './cache.js';

/**
 * Retrieves the latest audit log entry of a given type and target ID (if provided) in a guild.
 * @param guild - The guild to retrieve the audit log from.
 * @param type - The type of audit log entry to retrieve.
 * @param targetId - The ID of the target of the audit log entry to retrieve.
 * @returns The latest audit log entry of the given type
 * and target ID (if provided), or undefined if no such entry exists.
 */
export default async (guild: Discord.Guild, type: number, targetId?: string) => {
 const audits = await cache.auditLogs.get(guild, type);
 if (!audits?.length) return undefined;

 return audits
  .filter((entry) => (targetId && entry.target ? entry.targetId === targetId : true))
  .sort((a, b) => getUnix(b.id) - getUnix(a.id))[0];
};
