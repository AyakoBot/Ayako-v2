import * as Discord from 'discord.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from './addReaction.js';

/**
 * Unpins a message from a channel.
 * @param msg The message to unpin.
 * @returns A promise that resolves with the unpinned message, or rejects with an error.
 */
export default async (msg: Discord.Message<true>) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canUnPinMessage(msg.channelId, await getBotMemberFromGuild(msg.guild))) {
  const e = requestHandlerError(`Cannot unpin message in ${msg.guild.name} / ${msg.guild.id}`, [
   Discord.PermissionFlagsBits.ManageMessages,
  ]);

  error(msg.guild, e);
  return e;
 }

 return (await getAPI(msg.guild)).channels
  .unpinMessage(msg.channelId, msg.id)
  .catch((e: Discord.DiscordAPIError) => {
   error(msg.guild, e);
   return e;
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
