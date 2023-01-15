import client from '../../../BaseClient/DDenoClient.js';
import type CT from '../../../Typings/CustomTypings';

export default async (payload: {
  guildScheduledEventId: bigint;
  guildId: bigint;
  userId: bigint;
}) => {
  const cache = await client.ch.cache.scheduledEvents.get(
    payload.guildScheduledEventId,
    payload.guildId,
  );

  if (!cache) return;
  if (!cache.users?.includes(payload.userId)) cache.users?.push(payload.userId);

  const files: {
    default: (p: CT.ScheduledEvent, a: typeof payload) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(cache, payload));
};
