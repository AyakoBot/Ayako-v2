import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Pins a message in a guild text-based channel.
 * @param channel - The guild text-based channel where the message will be pinned.
 * @param message - The message to be pinned.
 * @returns A promise that resolves with the pinned message, or rejects with a DiscordAPIError.
 */
export default async (channel: Discord.GuildTextBasedChannel, message: Discord.Message<true>) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canPinMessage(channel, await getBotMemberFromGuild(channel.guild))) {
  const e = requestHandlerError(`Cannot pin message in ${channel.name} / ${channel.id}`, [
   Discord.PermissionFlagsBits.ManageMessages,
  ]);

  error(channel.guild, e);
  return e;
 }

 return (cache.apis.get(channel.guild.id) ?? API).channels
  .pinMessage(channel.id, message.id)
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the user has the permission to pin messages in a guild text-based channel.
 * @param channel - The guild text-based channel to check.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user can pin messages in the channel.
 */
export const canPinMessage = (channel: Discord.GuildTextBasedChannel, me: Discord.GuildMember) =>
 me.permissionsIn(channel).has(Discord.PermissionFlagsBits.ManageMessages);
