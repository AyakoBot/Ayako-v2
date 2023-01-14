import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';
import type CT from '../../../Typings/CustomTypings';

export default async (scheduledEvent: DDeno.ScheduledEvent) => {
  (scheduledEvent as CT.ScheduledEvent).users = await client.ch.getScheduledEventUsers(
    scheduledEvent.guildId,
    scheduledEvent,
  );
  client.ch.cache.scheduledEvents.set(scheduledEvent);

  // TODO
};
