import type * as Discord from 'discord.js';
import log from './log.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (webhook: Discord.Webhook, channel: Discord.GuildTextBasedChannel) => {
 ch.cache.webhooks.set(webhook);
 log(webhook, channel);
};
