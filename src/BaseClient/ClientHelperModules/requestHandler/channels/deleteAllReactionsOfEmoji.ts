import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Deletes all reactions of a specific emoji from a message.
 * @param message The message object from which to delete the reactions.
 * @param emoji The emoji to delete reactions for.
 * @returns A promise that resolves with a DiscordAPIError if the operation fails,
 * or void if it succeeds.
 */
export default async (message: Discord.Message<true>, emoji: string) => {
 if (!canDeleteAllreactionsOfEmoji(message.channel, await getBotMemberFromGuild(message.guild))) {
  const e = requestHandlerError(
   `Cannot delete all reactions of emoji ${emoji} in ${message.guild.name} / ${message.guild.id}`,
   [Discord.PermissionFlagsBits.ManageMessages],
  );

  error(message.guild, e);
  return e;
 }

 const resolvedEmoji = Discord.resolvePartialEmoji(emoji) as Discord.PartialEmoji;
 if (!resolvedEmoji) {
  return new Discord.DiscordjsTypeError(
   Discord.DiscordjsErrorCodes.EmojiType,
   'emoji',
   'EmojiIdentifierResolvable',
  ) as Discord.DiscordAPIError;
 }

 return (cache.apis.get(message.guild.id) ?? API).channels
  .deleteAllMessageReactionsForEmoji(
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

export const canDeleteAllreactionsOfEmoji = (
 channel: Discord.GuildBasedChannel,
 me: Discord.GuildMember,
) => me.permissionsIn(channel).has(Discord.PermissionFlagsBits.ManageMessages);
