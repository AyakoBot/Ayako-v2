import * as Discord from 'discord.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Sets the positions of a batch of channels for a guild.
 * @param guild - The guild to set the channel positions for.
 * @param body - The JSON body containing the new positions of the channels.
 * @param reason - The reason for setting the channel positions (optional).
 * @returns A promise that resolves with the updated guild channel positions,
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPatchAPIGuildChannelPositionsJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canSetChannelPositions(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot set channel positions`, [
   Discord.PermissionFlagsBits.ManageChannels,
  ]);

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (await getAPI(guild)).guilds
  .setChannelPositions(guild.id, body, { reason })
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
};

/**
 * Checks if the user has the necessary permissions to set channel positions.
 * @param me - The Discord guild member representing the user.
 * @returns A boolean indicating whether the user can set channel positions.
 */
export const canSetChannelPositions = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageChannels);
