import type * as DDeno from 'discordeno';
import client from '../DDenoClient.js';

export default (channel: DDeno.Channel, audit: DDeno.AuditLogEntry | undefined) => {
  if (audit && audit.userId) return client.cache.users.get(audit.userId);
  if (channel.ownerId) return client.cache.users.get(channel.ownerId);
  return null;
};
