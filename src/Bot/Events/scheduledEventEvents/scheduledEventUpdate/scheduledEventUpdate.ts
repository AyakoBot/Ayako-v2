import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (event: DDeno.ScheduledEvent) => {
  const cached = client.ch.cache.scheduledEvents.cache.get(event.guildId)?.get(event.id);
  client.ch.cache.scheduledEvents.set(event);
  if (!cached) return;

  const files: {
    default: (p: DDeno.ScheduledEvent, d: DDeno.ScheduledEvent) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(cached, event));
};
