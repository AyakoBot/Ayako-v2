import * as Discord from 'discord.js';
import error from './error.js';
import cache from './cache.js';
import constants from '../Other/constants.js';

export default async (channel: Discord.GuildTextBasedChannel | Discord.ForumChannel) => {
 if (channel.isThread()) channel = channel.parent as NonNullable<typeof channel.parent>;

 const webhooksArray = Array.from(
  cache.webhooks.cache.get(channel.guild.id)?.get(channel.id)?.values() || [],
 );

 const webhooks = !webhooksArray.length
  ? (
     (await channel.fetchWebhooks().catch(() => [])) as Discord.Collection<string, Discord.Webhook>
    ).map((o) => o)
  : webhooksArray;

 const webhook =
  webhooks.find((w) => w.owner?.id === channel.client.user.id) ??
  (await channel
   .createWebhook({
    name: constants.standard.user(channel.client.user),
    avatar: channel.client.user.displayAvatarURL(),
   })
   .catch((err) => err as Discord.DiscordAPIError));

 if ('message' in webhook) {
  error(channel.guild, new Error(webhook.message));
  return undefined;
 }

 cache.webhooks.set(webhook);

 return webhook;
};
