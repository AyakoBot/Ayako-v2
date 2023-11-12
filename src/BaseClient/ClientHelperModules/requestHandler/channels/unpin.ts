import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Unpins a message from a channel.
 * @param message The message to unpin.
 * @returns A promise that resolves with the unpinned message, or rejects with an error.
 */
export default async (message: Discord.Message<true>) =>
 (cache.apis.get(message.guild.id) ?? API).channels
  .unpinMessage(message.channelId, message.id)
  .catch((e) => {
   error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
