import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves a message from a guild text-based channel by its ID.
 * @param channel - The guild text-based channel where the message is located.
 * @param messageId - The ID of the message to retrieve.
 * @returns A Promise that resolves with the retrieved message or rejects with an error.
 */
export default async (channel: Discord.GuildTextBasedChannel, messageId: string) =>
 channel.messages.cache.get(messageId) ??
 (cache.apis.get(channel.guild.id) ?? API).channels
  .getMessage(channel.id, messageId)
  .then((m) => {
   const parsed = new Classes.Message(channel.guild.client, m);
   if (channel.messages.cache.get(parsed.id)) return parsed;
   channel.messages.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
