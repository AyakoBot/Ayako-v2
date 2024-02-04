import type * as Discord from 'discord.js';

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

 createdWebhooks.forEach((w) =>
  channel.client.util.importCache.Events.BotEvents.webhooksEvents.webhooksCreates.webhooksCreates.file.default(
   w,
   channel,
  ),
 );
 deletedWebhooks.forEach((w) =>
  channel.client.util.importCache.Events.BotEvents.webhooksEvents.webhooksDeletes.webhooksDeletes.file.default(
   w,
   channel,
  ),
 );
 updatedWebhooks.forEach((w) => {
  const oldW = oldWebhooks.find((w2) => w2.id === w.id);
  if (!oldW) return;
  const newW = newWebhooks.find((w2) => w2.id === w.id);
  if (!newW) return;

  channel.client.util.importCache.Events.BotEvents.webhooksEvents.webhooksUpdates.webhooksUpdates.file.default(
   oldW,
   newW,
   channel,
  );
 });
};
