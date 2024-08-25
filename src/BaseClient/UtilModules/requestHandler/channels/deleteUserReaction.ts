import * as Discord from 'discord.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from './addReaction.js';

/**
 * Deletes a user's reaction from a message.
 * @param msg The message object from which the reaction is to be deleted.
 * @param userId The ID of the user whose reaction is to be deleted.
 * @param emoji The emoji to be deleted.
 * @returns A promise that resolves with the deleted reaction, or rejects with an error.
 */
export default async (msg: Discord.Message<true>, userId: string, emoji: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDeleteUserReaction(msg.channel.id, await getBotMemberFromGuild(msg.guild))) {
  const e = requestHandlerError(
   `Cannot delete user reaction in ${msg.guild.name} / ${msg.guild.id}`,
   [Discord.PermissionFlagsBits.ManageMessages],
  );

  error(msg.guild, e);
  return e;
 }

 const resolvedEmoji = Discord.resolvePartialEmoji(emoji) as Discord.PartialEmoji;
 if (!resolvedEmoji) {
  const e = requestHandlerError(`Invalid Emoji ${emoji}`, []);

  error(msg.guild, e);
  return e;
 }

 return (await getAPI(msg.guild)).channels
  .deleteUserMessageReaction(
   msg.channel.id,
   msg.id,
   resolvedEmoji.id
    ? `${resolvedEmoji.animated ? 'a:' : ''}${resolvedEmoji.name}:${resolvedEmoji.id}`
    : (resolvedEmoji.name as string),
   userId,
  )
  .catch((e) => {
   error(msg.guild, e);
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the user has permission to delete a user's reaction in a channel.
 * @param channelId - The ID of the channel.
 * @param me - The Discord GuildMember object representing the user.
 * @returns True if the user has permission to manage messages in the channel, false otherwise.
 */
export const canDeleteUserReaction = (channelId: string, me: Discord.GuildMember) =>
 me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageMessages);
