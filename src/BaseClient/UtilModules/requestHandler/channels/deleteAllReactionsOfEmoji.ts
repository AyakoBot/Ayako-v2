import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Deletes all reactions of a specific emoji from a message.
 * @param message The message object from which to delete the reactions.
 * @param emoji The emoji to delete reactions for.
 * @returns A promise that resolves with a DiscordAPIError if the operation fails,
 * or void if it succeeds.
 */
export default async (message: Discord.Message<true>, emoji: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (
  !canDeleteAllreactionsOfEmoji(
   message.channel.id,
   await message.client.util.getBotMemberFromGuild(message.guild),
  )
 ) {
  const e = message.client.util.requestHandlerError(
   `Cannot delete all reactions of emoji ${emoji} in ${message.guild.name} / ${message.guild.id}`,
   [Discord.PermissionFlagsBits.ManageMessages],
  );

  message.client.util.error(message.guild, e);
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

 return (
  message.client.util.cache.apis.get(message.guild.id) ?? new DiscordCore.API(message.client.rest)
 ).channels
  .deleteAllMessageReactionsForEmoji(
   message.channel.id,
   message.id,
   resolvedEmoji.id
    ? `${resolvedEmoji.animated ? 'a:' : ''}${resolvedEmoji.name}:${resolvedEmoji.id}`
    : (resolvedEmoji.name as string),
  )
  .catch((e) => {
   message.client.util.error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the user has the permission to delete all reactions of an emoji in a channel.
 * @param channelId - The ID of the channel.
 * @param me - The Discord GuildMember object representing the user.
 * @returns A boolean indicating whether the user
 * has the permission to delete all reactions of the emoji.
 */
export const canDeleteAllreactionsOfEmoji = (channelId: string, me: Discord.GuildMember) =>
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageMessages);
