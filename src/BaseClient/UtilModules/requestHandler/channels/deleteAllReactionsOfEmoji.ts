import * as Discord from 'discord.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from './addReaction.js';

/**
 * Deletes all reactions of a specific emoji from a message.
 * @param msg The message object from which to delete the reactions.
 * @param emoji The emoji to delete reactions for.
 * @returns A promise that resolves with a DiscordAPIError if the operation fails,
 * or void if it succeeds.
 */
export default async (msg: Discord.Message<true>, emoji: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDeleteAllreactionsOfEmoji(msg.channel.id, await getBotMemberFromGuild(msg.guild))) {
  const e = requestHandlerError(
   `Cannot delete all reactions of emoji ${emoji} in ${msg.guild.name} / ${msg.guild.id}`,
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
  .deleteAllMessageReactionsForEmoji(
   msg.channel.id,
   msg.id,
   resolvedEmoji.id
    ? `${resolvedEmoji.animated ? 'a:' : ''}${resolvedEmoji.name}:${resolvedEmoji.id}`
    : (resolvedEmoji.name as string),
  )
  .catch((e) => {
   error(msg.guild, e);
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
