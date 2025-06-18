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
   })
 | Discord.Message<false>;

/**
 * Deletes a message from a channel.
 * @param msg The message to be deleted.
 * @returns A promise that resolves with the deleted message, or rejects with a DiscordAPIError.
 */
export default async <T extends Message>(
 msg: T,
 g: T extends Discord.Message<false> ? Discord.Guild : undefined,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');
 const guild = (g || msg.guild)!;

 if (!canDeleteMessages(msg, await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot delete message in ${guild.name} / ${guild.id}`, [
   Discord.PermissionFlagsBits.ManageMessages,
  ]);

  error(guild, e);
  return e;
 }

 return (await getAPI(guild)).channels
  .deleteMessage(msg.channelId, 'messageId' in msg ? msg.messageId! : msg.id)
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, e);
   return e;
  });
};

/**
 * Checks if the given message can be deleted by the user.
 * @param msg - The message to be checked.
 * @param me - The user's guild member object.
 * @returns A boolean indicating whether the user can delete the message.
 */
export const canDeleteMessages = (msg: Message, me: Discord.GuildMember) => {
 if (msg.author?.id === me.id) return true;
 if (!msg.guild) return false;

 return me.permissionsIn(msg.channel).has(Discord.PermissionFlagsBits.ManageMessages);
};
