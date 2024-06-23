import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

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
 * @param message The message to be deleted.
 * @returns A promise that resolves with the deleted message, or rejects with a DiscordAPIError.
 */
export default async (message: Message) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDeleteMessages(message, await getBotMemberFromGuild(message.guild))) {
  const e = requestHandlerError(
   `Cannot delete message in ${message.guild.name} / ${message.guild.id}`,
   [Discord.PermissionFlagsBits.ManageMessages],
  );

  error(message.guild, e);
  return e;
 }

 return (cache.apis.get(message.guild.id) ?? API).channels
  .deleteMessage(message.channelId, 'messageId' in message ? message.messageId! : message.id)
  .catch((e) => {
   error(message.guild, e);
   return e as Discord.DiscordAPIError;
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
