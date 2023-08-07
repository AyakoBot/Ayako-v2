import type * as Discord from 'discord.js';
import getUnix from './getUnix.js';
import cache from './cache.js';

export default async (guild: Discord.Guild, type: number, targetId?: string) => {
 const audits = await cache.auditLogs.get(guild, type);
 if (!audits?.length) return undefined;

 return audits
  .filter((entry) => (targetId && entry.target ? entry.targetId === targetId : true))
  .sort((a, b) => getUnix(b.id) - getUnix(a.id))[0];
};
