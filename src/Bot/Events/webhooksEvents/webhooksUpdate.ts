import type * as DDeno from 'discordeno';
import client from '../../BaseClient/DDenoClient.js';

export default async (payload: { channelId: bigint; guildId: bigint }) => {
  const oldWebhooks = client.ch.cache.webhooks.cache.get(payload.guildId)?.get(payload.channelId);
  const newWebhooks = await client.helpers.getChannelWebhooks(payload.channelId);

  newWebhooks.forEach((w) => {
    client.ch.cache.webhooks.set(w);
  });

  if (!oldWebhooks) return;
  const changed = client.ch.getChanged(
    Array.from(oldWebhooks, ([, w]) => w),
    newWebhooks.map((w) => w),
    'id',
  );
  const removed = client.ch.getDifference(
    Array.from(oldWebhooks, ([, w]) => w),
    newWebhooks.map((w) => w),
  );
  const added = client.ch.getDifference(
    newWebhooks.map((w) => w),
    Array.from(oldWebhooks, ([, w]) => w),
  );

  // TODO
};
