import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Follows announcements from a specified channel in a guild text-based channel.
 * @param channel - The guild text-based channel to follow announcements in.
 * @param followedChannelId - The ID of the channel to follow announcements from.
 * @returns A Promise that resolves to an object containing the ID of the source channel
 * and the ID of the created webhook,
 * or rejects with a DiscordAPIError.
 */
export default (channel: Discord.GuildTextBasedChannel, followedChannelId: string) =>
 (cache.apis.get(channel.guild.id) ?? API).channels
  .followAnnouncements(channel.id, followedChannelId)
  .then((c) => ({ sourceChannelId: c.channel_id, createdWebhookId: c.webhook_id }))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
