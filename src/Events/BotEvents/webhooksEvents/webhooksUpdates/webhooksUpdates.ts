import type * as Discord from 'discord.js';

export default async (
 oldWebhook: Discord.Webhook,
 webhook: Discord.Webhook,
 channel: Discord.GuildTextBasedChannel,
) => {
 webhook.client.util.cache.webhooks.set(webhook);
 webhook.client.util.importCache.Events.BotEvents.webhooksEvents.webhooksUpdates.log.file.default(
  oldWebhook,
  webhook,
  channel,
 );
};
