import type * as DDeno from 'discordeno';
import client from '../DDenoClient.js';

export default async (
  guild: DDeno.Guild,
  actionType: number,
  targetId?: bigint,
  otherFilterArguments?: (entry: DDeno.AuditLogEntry) => boolean,
) => {
  const audits = await client.helpers.getAuditLog(guild.id, { limit: 10, actionType });
  if (!audits || !audits.auditLogEntries) return undefined;

  return audits.auditLogEntries
    .filter((entry) => (targetId ? entry.targetId === targetId : true))
    .filter(otherFilterArguments || (() => true))
    .sort((a, b) => client.ch.getUnix(b.id) - client.ch.getUnix(a.id))[0];
};
