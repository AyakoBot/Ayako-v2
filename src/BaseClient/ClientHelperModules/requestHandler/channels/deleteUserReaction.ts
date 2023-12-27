import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Deletes a user's reaction from a message.
 * @param message The message object from which the reaction is to be deleted.
 * @param userId The ID of the user whose reaction is to be deleted.
 * @param emoji The emoji to be deleted.
 * @returns A promise that resolves with the deleted reaction, or rejects with an error.
 */
export default async (message: Discord.Message<true>, userId: string, emoji: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDeleteUserReaction(message.channel, await getBotMemberFromGuild(message.guild))) {
  const e = requestHandlerError(
   `Cannot delete user reaction in ${message.guild.name} / ${message.guild.id}`,
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
  .deleteUserMessageReaction(
   message.channel.id,
   message.id,
   resolvedEmoji.id
    ? `${resolvedEmoji.animated ? 'a:' : ''}${resolvedEmoji.name}:${resolvedEmoji.id}`
    : (resolvedEmoji.name as string),
   userId,
  )
  .catch((e) => {
   error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

export const canDeleteUserReaction = (
 channel: Discord.GuildBasedChannel,
 me: Discord.GuildMember,
) => me.permissionsIn(channel).has(Discord.PermissionFlagsBits.ManageMessages);
