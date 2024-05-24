import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Deletes the reaction of the bot on a message.
 * @param message - The message object to delete the reaction from.
 * @param emoji - The emoji to delete from the message.
 * @returns A promise that resolves with the deleted reaction or rejects with an error.
 */
export default async (message: Discord.Message<true>, emoji: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 const resolvedEmoji = Discord.resolvePartialEmoji(emoji) as Discord.PartialEmoji;
 if (!resolvedEmoji) {
  const e = requestHandlerError(`Invalid Emoji ${emoji}`, []);

  error(message.guild, e);
  return e;
 }

 return (cache.apis.get(message.guild.id) ?? API).channels
  .deleteOwnMessageReaction(
   message.channel.id,
   message.id,
   resolvedEmoji.id
    ? `${resolvedEmoji.animated ? 'a:' : ''}${resolvedEmoji.name}:${resolvedEmoji.id}`
    : (resolvedEmoji.name as string),
  )
  .catch((e) => {
   error(message.guild, e);
   return e as Discord.DiscordAPIError;
  });
};
