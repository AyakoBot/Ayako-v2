import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Deletes all reactions from a message in a channel.
 * @param message The message to delete reactions from.
 * @returns A promise that resolves with the deleted message, or rejects with a DiscordAPIError.
 */
export default async (message: Discord.Message<true>) =>
 (cache.apis.get(message.guild.id) ?? API).channels
  .deleteAllMessageReactions(message.channel.id, message.id)
  .catch((e) => {
   error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
