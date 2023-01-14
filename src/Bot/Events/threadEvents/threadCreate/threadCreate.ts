import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (thread: DDeno.Channel) => {
  client.ch.cache.channels.set(thread);

  // TODO
};
