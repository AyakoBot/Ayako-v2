import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';

/**
 * Removes a role from a member in a guild.
 * @param guild - The guild where the member is in.
 * @param userId - The ID of the member to remove the role from.
 * @param roleId - The ID of the role to remove from the member.
 * @param reason - The reason for removing the role (optional).
 * @returns A promise that resolves with the removed role or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, userId: string, roleId: string, reason?: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canRemoveRoleFromMember(await guild.client.util.getBotMemberFromGuild(guild), roleId)) {
  const e = guild.client.util.requestHandlerError(`Cannot remove role ${roleId} from Member`, [
   Discord.PermissionFlagsBits.ManageRoles,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? API).guilds
  .removeRoleFromMember(guild.id, userId, roleId, { reason })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the permission to remove roles.
 * @param me - The guild member to check.
 * @param roleId - The role ID of the role to remove.
 * @returns True if the guild member has the permission to remove roles, false otherwise.
 */
export const canRemoveRoleFromMember = (me: Discord.GuildMember, roleId: string) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageRoles) &&
 me.roles.highest.comparePositionTo(roleId) > 0;
