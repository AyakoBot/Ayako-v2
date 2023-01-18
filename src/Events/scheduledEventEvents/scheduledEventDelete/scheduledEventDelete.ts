import type * as Discord from 'discord.js';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/Client.js';

export default async (event: DDeno.ScheduledEvent) => {
  const cache = client.ch.cache.scheduledEvents.cache.get(event.guild.id)?.get(event.id);
  if (cache) event = cache;

  client.ch.cache.scheduledEvents.delete(event.id);

  const files: {
    default: (p: CT.ScheduledEvent) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(event));
};
