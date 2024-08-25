import * as Discord from 'discord.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from './addReaction.js';

/**
 * Pins a message in a guild text-based channel.
 * @param msg - The message to be pinned.
 * @returns A promise that resolves with the pinned message, or rejects with a DiscordAPIError.
 */
export default async (msg: Discord.Message<true>) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canPinMessage(msg.channelId, await getBotMemberFromGuild(msg.guild))) {
  const e = requestHandlerError(`Cannot pin message in ${msg.channel.name} / ${msg.channel.id}`, [
   Discord.PermissionFlagsBits.ManageMessages,
  ]);

  error(msg.channel.guild, e);
  return e;
 }

 return (await getAPI(msg.guild)).channels.pinMessage(msg.channelId, msg.id).catch((e) => {
  error(msg.guild, e);
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
