import type * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';
import webhooksUpdates from './webhooksUpdates/webhooksUpdates.js';
import webhooksDeletes from './webhooksDeletes/webhooksDeletes.js';
import webhooksCreates from './webhooksCreates/webhooksCreates.js';
import { Webhook } from '../../BaseClient/Other/classes.js';

export default async (
 channel: Discord.TextChannel | Discord.NewsChannel | Discord.VoiceChannel | Discord.ForumChannel,
) => {
 const rawNewWebhooks = await ch.request.channels.getWebhooks(channel.guild, channel.id);
 if ('message' in rawNewWebhooks) {
  ch.error(channel.guild, new Error(rawNewWebhooks.message));
  return;
 }

 const newWebhooks = rawNewWebhooks.map((w) => new Webhook(channel.client, w));
 const oldWebhooks = [
  ...(ch.cache.webhooks.cache.get(channel.guildId)?.get(channel.id)?.values() ?? []),
 ];

 const createdWebhooks = newWebhooks.filter((w) => !oldWebhooks.find((w1) => w1.id === w.id));
 const deletedWebhooks = oldWebhooks.filter((w) => !newWebhooks.find((w1) => w1.id === w.id));
 const updatedWebhooks = ch.getChanged(oldWebhooks, newWebhooks, 'id');

 createdWebhooks.forEach((w) => webhooksCreates(w, channel));
 deletedWebhooks.forEach((w) => webhooksDeletes(w, channel));
 updatedWebhooks.forEach((w) => {
  const oldW = oldWebhooks.find((w2) => w2.id === w.id);
  if (!oldW) return;
  const newW = newWebhooks.find((w2) => w2.id === w.id);
  if (!newW) return;

  webhooksUpdates(oldW, newW, channel);
 });
};
