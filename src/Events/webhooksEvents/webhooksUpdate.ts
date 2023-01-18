import type * as Discord from 'discord.js';
import client from '../../BaseClient/Client.js';

export default async (payload: { channelId: bigint; guildId: bigint }) => {
  const oldWebhooks = client.ch.cache.webhooks.cache.get(payload.guild.id)?.get(payload.channelId);
  const newWebhooks = await client.helpers.getChannelWebhooks(payload.channelId);

  client.ch.cache.webhooks.cache.get(payload.guild.id)?.delete(payload.channelId);
  newWebhooks.forEach((w) => {
    client.ch.cache.webhooks.set(w);
  });

  if (!oldWebhooks) return;
  const changed = client.ch.getChanged(
    Array.from(oldWebhooks, ([, w]) => w),
    newWebhooks.map((w) => w),
    'id',
  ) as DDeno.Webhook[] | undefined;
  const removed = client.ch.getDifference(
    Array.from(oldWebhooks, ([, w]) => w),
    newWebhooks.map((w) => w),
  ) as DDeno.Webhook[];
  const added = client.ch.getDifference(
    newWebhooks.map((w) => w),
    Array.from(oldWebhooks, ([, w]) => w),
  ) as DDeno.Webhook[];

  if (changed?.length) {
    const changeEvent = (await import('./webhookUpdate/webhookUpdate.js')).default;
    changed.forEach((c) =>
      changeEvent(oldWebhooks.get(c.id), newWebhooks.get(c.id) as DDeno.Webhook),
    );
  }

  if (removed.length) {
    const removeEvent = (await import('./webhookDelete/webhookDelete.js')).default;
    removed.forEach((c) => removeEvent(c));
  }

  if (added.length) {
    const addedEvent = (await import('./webhookCreate/webhookCreate.js')).default;
    added.forEach((c) => addedEvent(c));
  }
};
