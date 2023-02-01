import type * as Discord from 'discord.js';
import client from '../../BaseClient/Client.js';

export default async (
  channel: Discord.TextChannel | Discord.NewsChannel | Discord.VoiceChannel | Discord.ForumChannel,
) => {
  const cacheNew = () => {
    client.cache.webhooks.cache.get(channel.guild.id)?.delete(channel.id);
    newWebhooks.forEach((w) => {
      client.cache.webhooks.set(w);
    });
  };

  const oldWebhooks =
    client.cache.webhooks.cache.get(channel.guild.id)?.get(channel.id) ??
    new Map<string, Discord.Webhook>();
  const newWebhooks = await channel.fetchWebhooks();

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

  let wasUpdate = false;

  changed?.forEach((c) => {
    const before = oldWebhooks.get(c.id);
    const after = newWebhooks.get(c.id);
    if (!before || !after) return;

    wasUpdate = true;
    client.emit('webhooksUpdate', before, after, channel);
  });

  if (wasUpdate) {
    cacheNew();
    return;
  }

  if (removed.length) {
    removed.forEach((c) => client.emit('webhooksDelete', c, channel));
    cacheNew();
    return;
  }

  if (!added.length) return;

  added.forEach((c) => {
    const switchedChannelWebhook = client.cache.webhooks.find(c.id);
    if (switchedChannelWebhook) {
      client.emit('webhooksUpdate', switchedChannelWebhook, c, channel);
      cacheNew();
      return;
    }

    client.emit('webhooksCreate', c, channel);
    cacheNew();
  });
};
