import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Deletes a message from a channel.
 * @param message The message to be deleted.
 * @returns A promise that resolves with the deleted message, or rejects with a DiscordAPIError.
 */
export default async (message: Discord.Message<true>) => {
 if (!canDeleteMessages(message, await getBotMemberFromGuild(message.guild))) {
  const e = requestHandlerError(
   `Cannot delete message in ${message.guild.name} / ${message.guild.id}`,
   [Discord.PermissionFlagsBits.ManageMessages],
  );

  error(message.guild, e);
  return e;
 }

 return (cache.apis.get(message.guild.id) ?? API).channels
  .deleteMessage(message.channelId, message.id)
  .catch((e) => {
   error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given message can be deleted by the user.
 * @param msg - The message to be checked.
 * @param me - The user's guild member object.
 * @returns A boolean indicating whether the user can delete the message.
 */
export const canDeleteMessages = (msg: Discord.Message<true>, me: Discord.GuildMember) =>
 msg.author.id === me.id
  ? true
  : me.permissionsIn(msg.channel).has(Discord.PermissionFlagsBits.ManageMessages);
