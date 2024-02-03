import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';

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
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canBanUser(await guild.client.util.getBotMemberFromGuild(guild))) {
  const e = guild.client.util.requestHandlerError(`Cannot ban user ${userId}`, [
   Discord.PermissionFlagsBits.BanMembers,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? API).guilds
  .banUser(guild.id, userId, body, { reason })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
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
