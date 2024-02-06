import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Unpins a message from a channel.
 * @param message The message to unpin.
 * @returns A promise that resolves with the unpinned message, or rejects with an error.
 */
export default async (message: Discord.Message<true>) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (
  !canUnPinMessage(
   message.channelId,
   await message.client.util.getBotMemberFromGuild(message.guild),
  )
 ) {
  const e = message.client.util.requestHandlerError(
   `Cannot unpin message in ${message.guild.name} / ${message.guild.id}`,
   [Discord.PermissionFlagsBits.ManageMessages],
  );

  message.client.util.error(message.guild, e);
  return e;
 }

 return (
  message.client.util.cache.apis.get(message.guild.id) ?? new DiscordCore.API(message.client.rest)
 ).channels
  .unpinMessage(message.channelId, message.id)
  .catch((e) => {
   message.client.util.error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the user has the permission to unpin messages in a guild text-based channel.
 * @param channelId - The ID of the guild text-based channel to check.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user can pin messages in the channel.
 */
export const canUnPinMessage = (channelId: string, me: Discord.GuildMember) =>
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageMessages);
