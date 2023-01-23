import type * as Discord from 'discord.js';
import getUnix from './getUnix.js';

export default async (guild: Discord.Guild, type: number, targetId?: string) => {
  const audits = await guild.fetchAuditLogs({ limit: 10, type });
  if (!audits || !audits.entries?.size) return undefined;

  return audits.entries
    .map((o) => o)
    .filter((entry) => (targetId && entry.target ? entry.target.id === targetId : true))
    .sort((a, b) => getUnix(b.id) - getUnix(a.id))[0];
};
