import type * as Discord from 'discord.js';
import client from '../Client.js';

export default async (guildId: bigint, scheduledEvent: DDeno.ScheduledEvent) => {
  const fetch = (lastId?: bigint) =>
    client.helpers.getScheduledEventUsers(guildId, scheduledEvent.id, {
      limit: 100,
      after: String(lastId),
      withMember: true,
    });

  const users = [...(await fetch()).map((o) => o)];

  for (let i = 1; i < scheduledEvent.userCount / 100 ?? 0; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    users.push(...(await fetch()).map((o) => o));
  }

  users.forEach((r) => {
    client.ch.cache.users.set(r.user);
    client.ch.cache.members.set(r.member);
  });

  return users.map((u) => u.user.id);
};
