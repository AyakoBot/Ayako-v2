import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Bans a user from a guild.
 * @param guild The guild to ban the user from.
 * @param userId The ID of the user to ban.
 * @param body Optional request body to send.
 * @param reason Reason for banning the user.
 * @returns A promise that resolves with the DiscordAPIError if the request fails, otherwise void.
 */
export default async (
 guild: Discord.Guild,
 userId: string,
 body?: Discord.RESTPutAPIGuildBanJSONBody,
 reason?: string,
) => {
 if (!canBanUser(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot ban user ${userId}`, [
   Discord.PermissionFlagsBits.BanMembers,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .banUser(guild.id, userId, body, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the permission to ban members.
 * @param me - The guild member to check.
 * @returns True if the guild member has the permission to ban members, false otherwise.
 */
export const canBanUser = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.BanMembers);
