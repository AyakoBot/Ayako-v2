import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Pins a message in a guild text-based channel.
 * @param channel - The guild text-based channel where the message will be pinned.
 * @param message - The message to be pinned.
 * @returns A promise that resolves with the pinned message, or rejects with a DiscordAPIError.
 */
export default async (channel: Discord.GuildTextBasedChannel, message: Discord.Message<true>) =>
 (cache.apis.get(channel.guild.id) ?? API).channels
  .pinMessage(channel.id, message.id)
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
