import type * as Discord from 'discord.js';
import client from '../../BaseClient/Client.js';

export default async (
  channel: Discord.TextChannel | Discord.NewsChannel | Discord.VoiceChannel | Discord.ForumChannel,
) => {
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

  changed?.forEach((w) => {
    const before = oldWebhooks.get(w.id);
    const after = newWebhooks.get(w.id);
    if (!before || !after) return;

    client.cache.webhooks.delete(w.id);
    client.cache.webhooks.set(w);

    client.emit('webhooksUpdate', before, after, channel);
  });

  if (removed.length) {
    removed.forEach((w) => {
      client.cache.webhooks.delete(w.id);
      client.cache.webhooks.set(w);

      client.emit('webhooksDelete', w, channel);
    });
    return;
  }

  if (!added.length) return;

  added.forEach((w) => {
    const switchedChannelWebhook = client.cache.webhooks.find(w.id);
    if (switchedChannelWebhook) {
      client.cache.webhooks.delete(switchedChannelWebhook.id);
      client.cache.webhooks.set(switchedChannelWebhook);

      client.emit('webhooksUpdate', switchedChannelWebhook, w, channel);
      return;
    }

    client.emit('webhooksCreate', w, channel);
  });
};
