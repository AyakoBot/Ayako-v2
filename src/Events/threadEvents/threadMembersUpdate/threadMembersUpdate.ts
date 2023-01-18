import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';

export default async (payload: {
  id: bigint;
  guildId: bigint;
  addedMembers?: DDeno.ThreadMember[];
  removedMemberIds?: bigint[];
}) => {
  const cached =
    client.ch.cache.threads.find(payload.id) ?? (await client.helpers.getChannel(payload.id));
  client.ch.cache.threads.delete(payload.id);
  if (!cached || !cached.parentId) return;

  (cached as CT.Thread).members = (await client.helpers.getThreadMembers(cached.id))
    .map((u) => u.id)
    .filter((u): u is bigint => !!u);
  client.ch.cache.threads.set(cached);

  const files: {
    default: (t: CT.Thread, p: typeof payload) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(cached, payload));
};
