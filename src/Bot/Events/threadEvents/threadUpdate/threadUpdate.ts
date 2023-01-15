import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (thread: DDeno.Channel) => {
  if (!thread.parentId) return;

  const cached = client.ch.cache.threads.cache
    .get(thread.guildId)
    ?.get(thread.parentId)
    ?.get(thread.id);
  client.ch.cache.threads.set(thread);

  if (!cached) return;

  (await import('../../channelEvents/channelUpdate/log.js')).default(thread, cached);
};
