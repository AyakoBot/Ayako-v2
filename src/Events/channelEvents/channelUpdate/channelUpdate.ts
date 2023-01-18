import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (channel: DDeno.Channel) => {
  const files: {
    default: (t: DDeno.Channel, o: DDeno.Channel | undefined) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  const cached = client.ch.cache.channels.cache.get(channel.guild.id)?.get(channel.id);

  files.forEach((f) => f.default(channel, cached));
};
