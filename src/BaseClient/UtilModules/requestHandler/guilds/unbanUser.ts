import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Unbans a user from the specified guild.
 * @param guild - The guild to unban the user from.
 * @param userId - The ID of the user to unban.
 * @param reason - The reason for unbanning the user (optional).
 * @returns A promise that resolves with the DiscordAPIError if an error occurs, otherwise void.
 */
export default async (guild: Discord.Guild, userId: string, reason?: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canUnbanUser(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot unban user ${userId}`, [
   Discord.PermissionFlagsBits.BanMembers,
  ]);

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .unbanUser(guild.id, userId, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the user has the necessary permissions to unban a user.
 * @param me - The Discord guild member representing the user.
 * @returns A boolean indicating whether the user can unban a user.
 */
export const canUnbanUser = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.BanMembers);
