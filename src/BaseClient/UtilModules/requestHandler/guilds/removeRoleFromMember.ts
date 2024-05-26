import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Removes a role from a member in a guild.
 * @param guild - The guild where the member is in.
 * @param userId - The ID of the member to remove the role from.
 * @param roleId - The ID of the role to remove from the member.
 * @param reason - The reason for removing the role (optional).
 * @returns A promise that resolves with the removed role or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 userId: string,
 role: Discord.Role,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canRemoveRoleFromMember(await getBotMemberFromGuild(guild), role)) {
  const e = requestHandlerError(`Cannot remove role ${role.name} / ${role.id}`, [
   Discord.PermissionFlagsBits.ManageRoles,
  ]);

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .removeRoleFromMember(guild.id, userId, role.id, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the permission to remove roles.
 * @param me - The guild member to check.
 * @param role - The role to remove.
 * @returns True if the guild member has the permission to remove roles, false otherwise.
 */
export const canRemoveRoleFromMember = (me: Discord.GuildMember, role: Discord.Role) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageRoles) &&
 role.comparePositionTo(me.roles.highest) < 0;
