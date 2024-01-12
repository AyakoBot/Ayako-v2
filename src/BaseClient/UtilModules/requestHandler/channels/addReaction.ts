import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Adds a reaction to a message.
 * @param msg The message to add the reaction to.
 * @param emoji The emoji to add as a reaction.
 * @returns A Promise that resolves with the DiscordAPIError if the reaction could not be added.
 */
export default async (msg: Discord.Message<true>, emoji: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!isReactable(msg, emoji, await getBotMemberFromGuild(msg.guild))) {
  const e = requestHandlerError(
   `Cannot apply ${emoji} as reaction in ${msg.channel.name} / ${msg.channel.id}`,
   [
    Discord.PermissionFlagsBits.AddReactions,
    Discord.PermissionFlagsBits.ReadMessageHistory,
    ...(emoji.includes(':') ? [Discord.PermissionFlagsBits.UseExternalEmojis] : []),
   ],
  );

  error(msg.guild, e);
  return e;
 }

 const resolvedEmoji = Discord.resolvePartialEmoji(emoji) as Discord.PartialEmoji;
 if (!resolvedEmoji) {
  return new Discord.DiscordjsTypeError(
   Discord.DiscordjsErrorCodes.EmojiType,
   'emoji',
   'EmojiIdentifierResolvable',
  ) as Discord.DiscordAPIError;
 }

 return (cache.apis.get(msg.guild.id) ?? API).channels
  .addMessageReaction(
   msg.channel.id,
   msg.id,
   resolvedEmoji.id
    ? `${resolvedEmoji.animated ? 'a:' : ''}${resolvedEmoji.name}:${resolvedEmoji.id}`
    : (resolvedEmoji.name as string),
  )
  .catch((e) => {
   error(msg.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if a message is reactable by a given user.
 * @param msg - The message to check.
 * @param emoji - The emoji to add as a reaction.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the message is reactable.
 */
export const isReactable = (msg: Discord.Message<true>, emoji: string, me: Discord.GuildMember) =>
 msg.channel.permissionsFor(me).has(Discord.PermissionFlagsBits.AddReactions) &&
 msg.channel.permissionsFor(me).has(Discord.PermissionFlagsBits.ReadMessageHistory) &&
 (emoji.includes(':')
  ? msg.channel.permissionsFor(me).has(Discord.PermissionFlagsBits.UseExternalEmojis)
  : true);
