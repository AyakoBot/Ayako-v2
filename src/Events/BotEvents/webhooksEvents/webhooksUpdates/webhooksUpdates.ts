import type * as Discord from 'discord.js';
import log from './log.js';

export default async (
 oldWebhook: Discord.Webhook,
 webhook: Discord.Webhook,
 channel: Discord.GuildTextBasedChannel,
) => {
 webhook.client.util.cache.webhooks.set(webhook);
 log(oldWebhook, webhook, channel);
};
