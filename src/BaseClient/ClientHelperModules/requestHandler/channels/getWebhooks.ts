import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the webhooks for a given guild text-based channel or forum channel.
 * @param channel - The guild text-based channel or forum channel to retrieve webhooks for.
 * @returns A promise that resolves with an array of webhooks for the given channel.
 */
export default async (channel: Discord.GuildTextBasedChannel | Discord.ForumChannel) =>
 (channel.guild ? cache.apis.get(channel.guild.id) ?? API : API).channels
  .getWebhooks(channel.id)
  .then((webhooks) => webhooks.map((w) => new Classes.Webhook(channel.client, w)))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
