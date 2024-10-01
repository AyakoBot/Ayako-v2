import * as Discord from 'discord.js';
import cache from './cache.js';
import constants from '../Other/constants.js';
import { request } from './requestHandler.js';
import { guildTextChannel } from './getChannel.js';

/**
 * Retrieves or creates a webhook for the given channel.
 * @param rawChannel - The channel to retrieve or create the webhook for.
 * @returns The webhook for the channel, or undefined if it could not be retrieved or created.
 */
export default async (
 rawChannel: Discord.GuildTextBasedChannel | Discord.ForumChannel | Discord.MediaChannel | string,
) => {
 let channel =
  typeof rawChannel === 'string'
   ? ((await guildTextChannel(rawChannel)) as Discord.GuildTextBasedChannel | undefined)
   : rawChannel;

 if (!channel) return undefined;
 if (channel.isThread()) channel = channel.parent as NonNullable<typeof channel.parent>;
 if (!channel) return undefined;

 const webhooksArray = Array.from(
  cache.webhooks.cache.get(channel.guild.id)?.get(channel.id)?.values() || [],
 );

 const fetchWebhooks = async (
  c:
   | Discord.NewsChannel
   | Discord.StageChannel
   | Discord.TextChannel
   | Discord.VoiceChannel
   | Discord.ForumChannel
   | Discord.MediaChannel,
 ) => {
  const w = await request.channels.getWebhooks(c);
  if ('message' in w) return [];

  return w;
 };

 const createWebhook = async (
  c:
   | Discord.NewsChannel
   | Discord.StageChannel
   | Discord.TextChannel
   | Discord.VoiceChannel
   | Discord.ForumChannel
   | Discord.MediaChannel,
 ) => {
  const w = await request.channels.createWebhook(c.guild, c.id, {
   name: constants.standard.user(c.client.user),
   avatar: c.client.user.displayAvatarURL({ forceStatic: true, extension: 'png' }),
  });
  if ('message' in w) return undefined;

  return w;
 };

 const webhooks = !webhooksArray.length ? await fetchWebhooks(channel) : webhooksArray;

 const webhook =
  webhooks.find((w) => w.owner?.id === channel?.client.user.id) ?? (await createWebhook(channel));
 if (!webhook) return undefined;

 cache.webhooks.set(webhook);

 return webhook;
};
