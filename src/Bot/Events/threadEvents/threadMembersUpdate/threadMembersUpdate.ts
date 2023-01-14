import client from '../../../BaseClient/DDenoClient.js';

export default async (payload: {
  id: bigint;
  guildId: bigint;
  joinedAt: number;
  flags: number;
}) => {
  const cached =
    client.ch.cache.threads.find(payload.id) ?? (await client.helpers.getChannel(payload.id));
  client.ch.cache.threads.delete(payload.id);

  if (!cached || !cached.parentId) return;
  const after = await client.ch.cache.threads.get(payload.id, cached?.parentId, payload.guildId);

  // TODO
};
