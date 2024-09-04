import * as Discord from 'discord.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';
import { canBanUser } from './banUser.js';

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

 if (!canBanUser(await getBotMemberFromGuild(member.guild))) {
  const e = requestHandlerError(`Cannot ban member in ${member.displayName} / ${member.id}`, [
   Discord.PermissionFlagsBits.BanMembers,
  ]);

  error(member.guild, e);
  return e;
 }

 return (await getAPI(member.guild)).guilds
  .banUser(member.guild.id, member.id, body, { reason })
  .catch((e: Discord.DiscordAPIError) => {
   error(member.guild, e);
   return e;
  });
};

/**
 * Checks if the given guild member has the permission to ban another member.
 * @param me - The guild member to check.
 * @returns True if the guild member has the permission to ban another member, false otherwise.
 */
export const canBanMember = (me: Discord.GuildMember, member: Discord.GuildMember) =>
 me.guild.ownerId === me.id ||
 (canBanUser(me) && member.roles.highest.comparePositionTo(me.roles.highest) < 0);
