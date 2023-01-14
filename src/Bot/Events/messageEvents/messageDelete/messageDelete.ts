import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (
  payload: {
    id: bigint;
    channelId: bigint;
    guildId?: bigint;
  },
  message: DDeno.Message,
  executor?: DDeno.User,
) => {
  if (!payload) return;
  if (!('guildId' in payload) || !payload.guildId) return;

  const cached = client.ch.cache.messages.cache
    .get(payload.guildId)
    ?.get(payload.channelId)
    ?.get(payload.id);
  if (cached) message = cached;
  client.ch.cache.messages.delete(payload.id);

  const files: { default: (t: DDeno.Message, e?: DDeno.User) => void }[] = await Promise.all(
    ['./giveaway.js', './log.js'].map((p) => import(p)),
  );

  files.forEach((f) => f.default(message, executor));
};
