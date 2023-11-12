import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Adds a reaction to a message.
 * @param message The message to add the reaction to.
 * @param emoji The emoji to add as a reaction.
 * @returns A Promise that resolves with the DiscordAPIError if the reaction could not be added.
 */
export default async (message: Discord.Message<true>, emoji: string) => {
 const resolvedEmoji = Discord.resolvePartialEmoji(emoji);
 if (!resolvedEmoji) {
  return new Discord.DiscordjsTypeError(
   Discord.DiscordjsErrorCodes.EmojiType,
   'emoji',
   'EmojiIdentifierResolvable',
  ) as Discord.DiscordAPIError;
 }

 return (cache.apis.get(message.guild.id) ?? API).channels
  .addMessageReaction(
   message.channel.id,
   message.id,
   resolvedEmoji.id
    ? `${resolvedEmoji.animated ? 'a:' : ''}${resolvedEmoji.name}:${resolvedEmoji.id}`
    : (resolvedEmoji.name as string),
  )
  .catch((e) => {
   error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
