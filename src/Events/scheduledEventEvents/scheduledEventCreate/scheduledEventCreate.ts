import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';

export default async (scheduledEvent: DDeno.ScheduledEvent) => {
  (scheduledEvent as CT.ScheduledEvent).users = await client.ch.getScheduledEventUsers(
    scheduledEvent.guildId,
    scheduledEvent,
  );
  client.ch.cache.scheduledEvents.set(scheduledEvent);

  // TODO
};
