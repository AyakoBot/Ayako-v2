import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (thread: DDeno.Channel) => {
  const cached = client.ch.cache.channels.cache.get(thread.guildId)?.get(thread.id);
  if (cached) thread = cached;
  client.ch.cache.channels.delete(thread.id);

  // TODO
};
