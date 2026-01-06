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
export default async (
 msg: Discord.Message | { guild: undefined; id: string; channelId: string },
 guild: Discord.Guild | null,
) => {
 const g = msg.guild || guild;

 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (g && !canUnPinMessage(msg.channelId, await getBotMemberFromGuild(g))) {
  const e = requestHandlerError(`Cannot unpin message in ${g.name} / ${g.id}`, [
   Discord.PermissionFlagsBits.ManageMessages,
  ]);

  error(g, e);
  return e;
 }

 return (await getAPI(g)).channels
  .unpinMessage(msg.channelId, msg.id)
  .catch((e: Discord.DiscordAPIError) => {
   error(g, e);
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
