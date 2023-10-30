import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves a list of users who reacted with a specific emoji to a message.
 * @param message The message to retrieve reactions from.
 * @param emoji The emoji to retrieve reactions for.
 * @param query Optional query parameters to filter the results.
 * @returns A promise that resolves with an array of users who reacted with the specified emoji.
 */
export default (
 message: Discord.Message<true>,
 emoji: string,
 query?: Discord.RESTGetAPIChannelMessageReactionUsersQuery,
) => {
 const resolvedEmoji = Discord.resolvePartialEmoji(emoji);
 if (!resolvedEmoji) {
  return new Discord.DiscordjsTypeError(
   Discord.DiscordjsErrorCodes.EmojiType,
   'emoji',
   'EmojiIdentifierResolvable',
  ) as Discord.DiscordAPIError;
 }

 return (cache.apis.get(message.guild.id) ?? API).channels
  .getMessageReactions(
   message.channel.id,
   message.id,
   resolvedEmoji.id
    ? `${resolvedEmoji.animated ? 'a:' : ''}${resolvedEmoji.name}:${resolvedEmoji.id}`
    : (resolvedEmoji.name as string),
   query,
  )
  .then((users) => {
   const parsed = users.map((u) => new Classes.User(message.client, u));
   parsed.forEach((p) => {
    if (
     message.reactions.cache
      .get(resolvedEmoji.id ?? resolvedEmoji.name ?? '')
      ?.users.cache.get(p.id)
    ) {
     return;
    }

    if (
     (resolvedEmoji.id ?? resolvedEmoji.name) &&
     !message.reactions.cache.get(resolvedEmoji.id ?? resolvedEmoji.name ?? '')
    ) {
     message.reactions.cache.set(
      resolvedEmoji.id ?? resolvedEmoji.name ?? '',
      new Classes.MessageReaction(
       message.client,
       {
        count: parsed.length,
        emoji: {
         id: resolvedEmoji.id ?? null,
         name: resolvedEmoji.name ?? null,
         animated: resolvedEmoji.animated,
        },
        me: false,
       },
       message,
      ),
     );
    }

    message.reactions.cache
     .get(resolvedEmoji.id ?? resolvedEmoji.name ?? '')
     ?.users.cache.set(p.id, p);
   });
  })
  .catch((e) => {
   error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
