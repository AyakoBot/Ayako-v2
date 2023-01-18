import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (thread: DDeno.Channel) => {
  if (!thread.parentId) return;

  const cached = client.ch.cache.threads.cache
    .get(thread.guild.id)
    ?.get(thread.parentId)
    ?.get(thread.id);
  client.ch.cache.threads.set(thread);

  if (!cached) return;

  (await import('../../channelEvents/channelUpdate/log.js')).default(thread, cached);
};
