import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (thread: DDeno.Channel) => {
  client.ch.cache.channels.set(thread);

  (await import('../../channelEvents/channelCreate/log.js')).default(thread);
};
