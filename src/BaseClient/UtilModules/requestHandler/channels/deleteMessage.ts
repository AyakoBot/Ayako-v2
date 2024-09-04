import * as Discord from 'discord.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from './addReaction.js';

type Message =
 | Discord.Message<true>
 | (Discord.MessageReference & {
    client: Discord.Client<true>;
    guild: Discord.Guild;
    channel: Discord.Message<true>['channel'];
    author: undefined;
   });

/**
 * Deletes a message from a channel.
 * @param msg The message to be deleted.
 * @returns A promise that resolves with the deleted message, or rejects with a DiscordAPIError.
 */
export default async (msg: Message) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDeleteMessages(msg, await getBotMemberFromGuild(msg.guild))) {
  const e = requestHandlerError(`Cannot delete message in ${msg.guild.name} / ${msg.guild.id}`, [
   Discord.PermissionFlagsBits.ManageMessages,
  ]);

  error(msg.guild, e);
  return e;
 }

 return (await getAPI(msg.guild)).channels
  .deleteMessage(msg.channelId, 'messageId' in msg ? msg.messageId! : msg.id)
  .catch((e: Discord.DiscordAPIError) => {
   error(msg.guild, e);
   return e;
  });
};

/**
 * Checks if the given message can be deleted by the user.
 * @param msg - The message to be checked.
 * @param me - The user's guild member object.
 * @returns A boolean indicating whether the user can delete the message.
 */
export const canDeleteMessages = (msg: Message, me: Discord.GuildMember) =>
 msg.author?.id === me.id
  ? true
  : me.permissionsIn(msg.channel).has(Discord.PermissionFlagsBits.ManageMessages);
