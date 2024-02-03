import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';

/**
 * Bans a user from a guild.
 * @param member The member to ban.
 * @param body Optional request body to send.
 * @param reason Reason for banning the user.
 * @returns A promise that resolves with the DiscordAPIError if the request fails, otherwise void.
 */
export default async (
 member: Discord.GuildMember,
 body?: Discord.RESTPutAPIGuildBanJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canBanMember(await member.client.util.getBotMemberFromGuild(member.guild), member)) {
  const e = member.client.util.requestHandlerError(
   `Cannot ban member in ${member.displayName} / ${member.id}\nPlease check role hierarchy`,
   [Discord.PermissionFlagsBits.BanMembers],
  );

  member.client.util.error(member.guild, e);
  return e;
 }

 return (member.client.util.cache.apis.get(member.guild.id) ?? API).guilds
  .banUser(member.guild.id, member.id, body, { reason })
  .catch((e) => {
   member.client.util.error(member.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the permission to ban another member.
 * @param me - The guild member to check.
 * @returns True if the guild member has the permission to ban another member, false otherwise.
 */
export const canBanMember = (me: Discord.GuildMember, member: Discord.GuildMember) =>
 me.guild.ownerId === me.id ||
 (me.client.util.importCache.BaseClient.UtilModules.requestHandler.guilds.banUser.file.canBanUser(
  me,
 ) &&
  member.roles.highest.comparePositionTo(me.roles.highest) < 0);
