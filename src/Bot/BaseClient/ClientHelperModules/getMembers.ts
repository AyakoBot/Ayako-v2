import type * as DDeno from 'discordeno';
import client from '../DDenoClient.js';

export default async (guildId: bigint) => {
  const fetch = (lastId?: bigint) =>
    client.helpers.getMembers(guildId, {
      limit: 1000,
      after: String(lastId),
    });

  const guild = await client.ch.cache.guilds.get(guildId);
  if (!guild) return undefined;

  const members: DDeno.Member[] = [];

  for (let i = 0; i < Number(guild?.approximateMemberCount) / 1000 ?? 0; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    members.push(...(await fetch()).map((o) => o));
  }

  members.forEach((r) => (r.user ? client.ch.cache.users.set(r.user) : null));

  return members;
};
