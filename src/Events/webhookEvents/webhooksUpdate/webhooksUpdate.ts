import type * as Discord from 'discord.js';
import log from './log.js';

export default async (
  oldWebhook: Discord.Webhook,
  webhook: Discord.Webhook,
  channel: Discord.TextChannel | Discord.NewsChannel | Discord.VoiceChannel | Discord.ForumChannel,
) => {
  log(oldWebhook, webhook, channel);
};
