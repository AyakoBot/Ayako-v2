import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Deletes all reactions from a message in a channel.
 * @param message The message to delete reactions from.
 * @returns A promise that resolves with the deleted message, or rejects with a DiscordAPIError.
 */
export default async (message: Discord.Message<true>) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (
  !canDeleteAllReactions(
   message.channel.id,
   await message.client.util.getBotMemberFromGuild(message.guild),
  )
 ) {
  const e = message.client.util.requestHandlerError(
   `Cannot delete all reactions of messages in ${message.guild.name} / ${message.guild.id}`,
   [Discord.PermissionFlagsBits.ManageMessages],
  );

  message.client.util.error(message.guild, e);
  return e;
 }

 return (
  message.client.util.cache.apis.get(message.guild.id) ?? new DiscordCore.API(message.client.rest)
 ).channels
  .deleteAllMessageReactions(message.channel.id, message.id)
  .catch((e) => {
   message.client.util.error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the user has the permission to delete all reactions in a channel.
 * @param channelId - The ID of the guild-based channel to check.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user has the permission to delete all reactions.
 */
export const canDeleteAllReactions = (channelId: string, me: Discord.GuildMember) =>
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageMessages);
