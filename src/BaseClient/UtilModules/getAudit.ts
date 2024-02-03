import type * as Discord from 'discord.js';

/**
 * Retrieves the latest audit log entry of a given type and target ID (if provided) in a guild.
 * @param guild - The guild to retrieve the audit log from.
 * @param type - The type of audit log entry to retrieve.
 * @param targetId - The ID of the target of the audit log entry to retrieve.
 * @returns The latest audit log entry of the given type
 * and target ID (if provided), or undefined if no such entry exists.
 */
export default async (guild: Discord.Guild, type: number, targetId?: string) => {
 await guild.client.util.sleep(1000);

 const audits = await guild.client.util.cache.auditLogs.get(guild, type);
 if (!audits?.length) return undefined;

 return audits
  .filter((entry) => (targetId && entry.target ? entry.targetId === targetId : true))
  .sort((a, b) => guild.client.util.getUnix(b.id) - guild.client.util.getUnix(a.id))[0];
};
