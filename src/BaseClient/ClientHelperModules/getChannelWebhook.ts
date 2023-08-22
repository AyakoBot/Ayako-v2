import * as Discord from 'discord.js';
import cache from './cache.js';
import constants from '../Other/constants.js';
import { request } from './requestHandler.js';
import * as Classes from '../Other/classes.js';

export default async (channel: Discord.GuildTextBasedChannel | Discord.ForumChannel) => {
 if (channel.isThread()) channel = channel.parent as NonNullable<typeof channel.parent>;

 const webhooksArray = Array.from(
  cache.webhooks.cache.get(channel.guild.id)?.get(channel.id)?.values() || [],
 );

 const fetchWebhooks = async () => {
  const w = await request.channels.getWebhooks(channel.guild, channel.id);
  if ('message' in w) return [];

  return w.map((webh) => new Classes.Webhook(channel.guild.client, webh));
 };

 const createWebhook = async () => {
  const w = await request.channels.createWebhook(channel.guild, channel.id, {
   name: constants.standard.user(channel.client.user),
   avatar: channel.client.user.displayAvatarURL({ forceStatic: true, extension: 'png' }),
  });
  if ('message' in w) return undefined;

  return new Classes.Webhook(channel.guild.client, w);
 };

 const webhooks = !webhooksArray.length ? await fetchWebhooks() : webhooksArray;

 const webhook =
  webhooks.find((w) => w.owner?.id === channel.client.user.id) ?? (await createWebhook());
 if (!webhook) return undefined;

 cache.webhooks.set(webhook);

 return webhook;
};
