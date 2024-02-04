import type * as Discord from 'discord.js';

export default async (webhook: Discord.Webhook, channel: Discord.GuildTextBasedChannel) => {
 webhook.client.util.cache.webhooks.delete(webhook.id);
 webhook.client.util.importCache.Events.BotEvents.webhooksEvents.webhooksDeletes.log.file.default(
  webhook,
  channel,
 );
};
