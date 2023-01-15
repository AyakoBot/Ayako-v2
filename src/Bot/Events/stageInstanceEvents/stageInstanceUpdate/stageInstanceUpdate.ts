import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (data: { id: bigint; guildId: bigint; channelId: bigint; topic: string }) => {
  const channel = await client.ch.cache.channels.get(data.channelId, data.guildId);
  if (!channel) return;

  const cache = client.ch.cache.stageInstances.cache.get(data.guildId)?.get(data.id);
  if (!cache) return;
  const fetched = await client.ch.cache.stageInstances.get(data.id, data.guildId);
  if (!fetched) return;

  const files: {
    default: (p: DDeno.StageInstance, t: DDeno.StageInstance) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(cache, fetched));
};
