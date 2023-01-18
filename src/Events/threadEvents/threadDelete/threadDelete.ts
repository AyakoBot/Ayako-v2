import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (thread: DDeno.Channel) => {
  const cached = client.ch.cache.channels.cache.get(thread.guildId)?.get(thread.id);
  if (cached) thread = cached;
  client.ch.cache.channels.delete(thread.id);

  (await import('../../channelEvents/channelDelete/log.js')).default(thread);
};
