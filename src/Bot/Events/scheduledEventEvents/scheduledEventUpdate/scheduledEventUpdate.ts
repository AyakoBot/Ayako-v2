import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (scheduledEvent: DDeno.ScheduledEvent) => {
  const cached = client.ch.cache.scheduledEvents.cache
    .get(scheduledEvent.guildId)
    ?.get(scheduledEvent.id);
  if (cached) scheduledEvent = cached;

  client.ch.cache.scheduledEvents.set(scheduledEvent);

  // TODO
};
