import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Deletes a message from a channel.
 * @param message The message to be deleted.
 * @returns A promise that resolves with the deleted message, or rejects with a DiscordAPIError.
 */
export default (message: Discord.Message<true>) =>
 (cache.apis.get(message.guild.id) ?? API).channels
  .deleteMessage(message.channelId, message.id)
  .catch((e) => {
   error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
