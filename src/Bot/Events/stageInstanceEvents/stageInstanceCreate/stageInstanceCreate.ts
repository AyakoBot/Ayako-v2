import client from '../../../BaseClient/DDenoClient.js';

export default async (data: { id: bigint; guildId: bigint; channelId: bigint; topic: string }) => {
  const channel = await client.ch.cache.channels.get(data.channelId, data.guildId);
  if (!channel) return;

  const cache = await client.ch.cache.stageInstances.get(data.id, data.guildId);
  if (!cache) return;

  // TODO
};
