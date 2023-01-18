import type * as Discord from 'discord.js';
import client from '../Client.js';

export default (channel: DDeno.Channel, audit: DDeno.AuditLogEntry | undefined) => {
  if (audit && audit.userId) return client.ch.cache.users.get(audit.userId);
  if (channel.ownerId) return client.ch.cache.users.get(channel.ownerId);
  return null;
};
