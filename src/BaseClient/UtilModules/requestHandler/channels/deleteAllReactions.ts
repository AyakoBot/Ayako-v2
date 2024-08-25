import * as Discord from 'discord.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from './addReaction.js';

/**
 * Deletes all reactions from a message in a channel.
 * @param msg The message to delete reactions from.
 * @returns A promise that resolves with the deleted message, or rejects with a DiscordAPIError.
 */
export default async (msg: Discord.Message<true>) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDeleteAllReactions(msg.channel.id, await getBotMemberFromGuild(msg.guild))) {
  const e = requestHandlerError(
   `Cannot delete all reactions of messages in ${msg.guild.name} / ${msg.guild.id}`,
   [Discord.PermissionFlagsBits.ManageMessages],
  );

  error(msg.guild, e);
  return e;
 }

 return (await getAPI(msg.guild)).channels
  .deleteAllMessageReactions(msg.channel.id, msg.id)
  .catch((e) => {
   error(msg.guild, e);
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
