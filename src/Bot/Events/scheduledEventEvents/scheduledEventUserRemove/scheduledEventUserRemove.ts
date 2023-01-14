import client from '../../../BaseClient/DDenoClient.js';

export default async (payload: {
  guildScheduledEventId: bigint;
  guildId: bigint;
  userId: bigint;
}) => {
  const cached = await client.ch.cache.scheduledEvents.get(
    payload.guildScheduledEventId,
    payload.guildId,
  );

  if (!cached) return;
  if (cached.users?.includes(payload.userId)) {
    cached.users?.splice(cached.users.indexOf(payload.userId), 1);
  }

  // TODO
};
