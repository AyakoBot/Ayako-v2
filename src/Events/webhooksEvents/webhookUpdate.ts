import type * as Discord from 'discord.js';
import webhooksCreates from './webhooksCreates/webhooksCreates.js';
import webhooksDeletes from './webhooksDeletes/webhooksDeletes.js';
import webhooksUpdates from './webhooksUpdates/webhooksUpdates.js';

export default async (channel: Discord.GuildTextBasedChannel) => {
 const newWebhooks = await channel.client.util.request.channels.getWebhooks(channel);
 if ('message' in newWebhooks) {
  channel.client.util.error(channel.guild, new Error(newWebhooks.message));
  return;
 }

 const oldWebhooks = [
  ...(channel.client.util.cache.webhooks.cache.get(channel.guildId)?.get(channel.id)?.values() ??
   []),
 ];

 const createdWebhooks = newWebhooks.filter((w) => !oldWebhooks.find((w1) => w1.id === w.id));
 const deletedWebhooks = oldWebhooks.filter((w) => !newWebhooks.find((w1) => w1.id === w.id));
 const updatedWebhooks = channel.client.util.getChanged(oldWebhooks, newWebhooks, 'id');

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
