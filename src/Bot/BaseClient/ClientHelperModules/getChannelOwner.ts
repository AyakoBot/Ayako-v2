import type * as DDeno from 'discordeno';
import client from '../DDenoClient';

export default (channel: DDeno.Channel, audit: DDeno.AuditLogEntry | null) => {
  if (audit && audit.userId) return client.cache.users.get(audit.userId);
  if (channel.ownerId) return client.cache.users.get(channel.ownerId);
  return null;
};
