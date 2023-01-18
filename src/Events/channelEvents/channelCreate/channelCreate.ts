import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (channel: DDeno.Channel) => {
  const files: {
    default: (t: DDeno.Channel) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  client.ch.cache.channels.set(channel);

  files.forEach((f) => f.default(channel));
};
