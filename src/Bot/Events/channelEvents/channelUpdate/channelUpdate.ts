import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (channel: DDeno.Channel) => {
  const files: {
    default: (t: DDeno.Channel, o: DDeno.Channel | undefined) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  const cached = client.ch.cache.channels.cache.get(channel.guildId)?.get(channel.id);

  files.forEach((f) => f.default(channel, cached));
};
