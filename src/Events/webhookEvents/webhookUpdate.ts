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
    changed.forEach((c) =>
      client.emit('webhooksUpdate', oldWebhooks.get(c.id), newWebhooks.get(c.id), channel),
    );
  }

  if (removed.length) removed.forEach((c) => client.emit('webhooksDelete', c, channel));
  if (added.length) removed.forEach((c) => client.emit('webhooksCreate', c, channel));
};
