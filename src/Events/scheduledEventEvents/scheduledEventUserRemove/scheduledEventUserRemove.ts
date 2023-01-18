import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/Client.js';

export default async (payload: {
  guildScheduledEventId: bigint;
  guildId: bigint;
  userId: bigint;
}) => {
  const cache = await client.ch.cache.scheduledEvents.get(
    payload.guildScheduledEventId,
    payload.guild.id,
  );

  if (!cache) return;
  if (cache.users?.includes(payload.userId)) {
    cache.users?.splice(cache.users.indexOf(payload.userId), 1);
  }

  const files: {
    default: (p: CT.ScheduledEvent, a: typeof payload) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(cache, payload));
};
