import type * as DDeno from 'discordeno';
import Discord from 'discord.js';
import client from '../DDenoClient.js';

export default async (
  guild: DDeno.Guild,
  actionType: number,
  targetId?: bigint,
  otherFilterArguments?: (entry: DDeno.AuditLogEntry) => boolean,
) => {
  const me = await client.helpers.getMember(guild.id, client.id);
  const mePerms = new Discord.PermissionsBitField(me.permissions);
  if (!mePerms.has(128n)) return null;

  const audits = await client.helpers.getAuditLog(guild.id, { limit: 10, actionType });
  if (!audits || !audits.auditLogEntries) return null;

  return audits.auditLogEntries
    .filter((entry) => (targetId ? entry.targetId === targetId : true))
    .filter(otherFilterArguments || (() => true))
    .sort((a, b) => client.ch.getUnix(b.id) - client.ch.getUnix(a.id))[0];
};
