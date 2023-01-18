import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (channel: DDeno.Channel) => {
  const files: {
    default: (t: DDeno.Channel) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  const cached = client.ch.cache.channels.cache.get(channel.guildId)?.get(channel.id);
  if (cached) channel = cached;
  client.ch.cache.channels.delete(channel.id);

  const channelBans = client.ch.cache.channelBans.cache.get(channel.guildId)?.get(channel.id);
  if (channelBans) {
    const array = Array.from(channelBans, ([, g]) => g);
    array.forEach((a) => a.reschedule(Date.now() + 10000));
  }

  files.forEach((f) => f.default(channel));
};
