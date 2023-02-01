import type * as Discord from 'discord.js';
import client from '../../BaseClient/Client.js';

export default async (
  channel: Discord.TextChannel | Discord.NewsChannel | Discord.VoiceChannel | Discord.ForumChannel,
) => {
  const oldWebhooks = client.cache.webhooks.cache.get(channel.guild.id)?.get(channel.id);
  const newWebhooks = await channel.fetchWebhooks();

  client.cache.webhooks.cache.get(channel.guild.id)?.delete(channel.id);
  newWebhooks.forEach((w) => {
    client.cache.webhooks.set(w);
  });

  if (!oldWebhooks) return;
  const changed = client.ch.getChanged(
    Array.from(oldWebhooks, ([, w]) => w) as unknown as { [key: string]: unknown }[],
    newWebhooks.map((w) => w) as unknown as { [key: string]: unknown }[],
    'id',
  ) as Discord.Webhook[] | undefined;

  const removed = client.ch.getDifference(
    Array.from(oldWebhooks, ([, w]) => w) as unknown as { [key: string]: unknown }[],
    newWebhooks.map((w) => w) as unknown as { [key: string]: unknown }[],
  ) as Discord.Webhook[];

  const added = client.ch.getDifference(
    newWebhooks.map((w) => w) as unknown as { [key: string]: unknown }[],
    Array.from(oldWebhooks, ([, w]) => w) as unknown as { [key: string]: unknown }[],
  ) as Discord.Webhook[];

  if (changed?.length) {
    const changeEvent = (await import('./webhooksUpdate/webhooksUpdate.js')).default;
    changed.forEach((c) => changeEvent(oldWebhooks.get(c.id), newWebhooks.get(c.id), channel));
  }

  if (removed.length) {
    const removeEvent = (await import('./webhooksDelete/webhooksDelete.js')).default;
    removed.forEach((c) => removeEvent(c, channel));
  }

  if (added.length) {
    const addedEvent = (await import('./webhooksCreate/webhooksCreate.js')).default;
    added.forEach((c) => addedEvent(c, channel));
  }
};
