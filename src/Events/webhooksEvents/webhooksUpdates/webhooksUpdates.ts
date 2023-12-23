import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (
 oldWebhook: Discord.Webhook,
 webhook: Discord.Webhook,
 channel: Discord.GuildTextBasedChannel,
) => {
 ch.cache.webhooks.set(webhook);
 log(oldWebhook, webhook, channel);
};
