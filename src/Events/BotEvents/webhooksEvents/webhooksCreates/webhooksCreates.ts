import type * as Discord from 'discord.js';

export default async (webhook: Discord.Webhook, channel: Discord.GuildTextBasedChannel) => {
 webhook.client.util.cache.webhooks.set(webhook);
 webhook.client.util.importCache.Events.BotEvents.webhooksEvents.webhooksCreates.log.file.default(
  webhook,
  channel,
 );
};
