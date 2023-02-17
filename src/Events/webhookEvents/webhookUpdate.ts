import type * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';
import client from '../../BaseClient/Client.js';

export default async (
  channel: Discord.TextChannel | Discord.NewsChannel | Discord.VoiceChannel | Discord.ForumChannel,
) => {
  const oldWebhooks =
    ch.cache.webhooks.cache.get(channel.guild.id)?.get(channel.id) ??
    new Map<string, Discord.Webhook>();
  const newWebhooks = await channel.fetchWebhooks();

  if (!oldWebhooks) return;
  const changed = ch.getChanged(
    Array.from(oldWebhooks, ([, w]) => w) as unknown as { [key: string]: unknown }[],
    newWebhooks.map((w) => w) as unknown as { [key: string]: unknown }[],
    'id',
  ) as Discord.Webhook[] | undefined;

  const removed = ch.getDifference(
    Array.from(oldWebhooks, ([, w]) => w) as unknown as { [key: string]: unknown }[],
    newWebhooks.map((w) => w) as unknown as { [key: string]: unknown }[],
  ) as Discord.Webhook[];

  const added = ch.getDifference(
    newWebhooks.map((w) => w) as unknown as { [key: string]: unknown }[],
    Array.from(oldWebhooks, ([, w]) => w) as unknown as { [key: string]: unknown }[],
  ) as Discord.Webhook[];

  changed?.forEach((w) => {
    const before = oldWebhooks.get(w.id);
    const after = newWebhooks.get(w.id);
    if (!before || !after) return;

    ch.cache.webhooks.delete(w.id);
    ch.cache.webhooks.set(w);

    client.emit('webhooksUpdate', before, after, channel);
  });

  if (removed.length) {
    removed.forEach((w) => {
      ch.cache.webhooks.delete(w.id);
      ch.cache.webhooks.set(w);

      client.emit('webhooksDelete', w, channel);
    });
    return;
  }

  if (!added.length) return;

  added.forEach((w) => {
    const switchedChannelWebhook = ch.cache.webhooks.find(w.id);
    if (switchedChannelWebhook) {
      ch.cache.webhooks.delete(switchedChannelWebhook.id);
      ch.cache.webhooks.set(switchedChannelWebhook);

      client.emit('webhooksUpdate', switchedChannelWebhook, w, channel);
      return;
    }

    client.emit('webhooksCreate', w, channel);
  });
};
