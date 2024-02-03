import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';

/**
 * Pins a message in a guild text-based channel.
 * @param msg - The message to be pinned.
 * @returns A promise that resolves with the pinned message, or rejects with a DiscordAPIError.
 */
export default async (message: Discord.Message<true>) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (
  !canPinMessage(message.channelId, await message.client.util.getBotMemberFromGuild(message.guild))
 ) {
  const e = message.client.util.requestHandlerError(
   `Cannot pin message in ${message.channel.name} / ${message.channel.id}`,
   [Discord.PermissionFlagsBits.ManageMessages],
  );

  message.client.util.error(message.channel.guild, e);
  return e;
 }

 return (message.client.util.cache.apis.get(message.guildId) ?? API).channels
  .pinMessage(message.channelId, message.id)
  .catch((e) => {
   message.client.util.error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the user has the permission to pin messages in a guild text-based channel.
 * @param channelId - The ID of the guild text-based channel to check.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user can pin messages in the channel.
 */
export const canPinMessage = (channelId: string, me: Discord.GuildMember) =>
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageMessages);
