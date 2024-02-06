import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Adds a role to a member in a guild.
 * @param guild - The guild where the member is in.
 * @param userId - The ID of the member to add the role to.
 * @param roleId - The ID of the role to add to the member.
 * @param reason - The reason for adding the role (optional).
 * @returns A promise that resolves with the updated member object if successful,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, userId: string, roleId: string, reason?: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canAddRoleToMember(await guild.client.util.getBotMemberFromGuild(guild), roleId)) {
  const e = guild.client.util.requestHandlerError(`Cannot add role ${roleId} to member`, [
   Discord.PermissionFlagsBits.ManageRoles,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (
  guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)
 ).guilds
  .addRoleToMember(guild.id, userId, roleId, { reason })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if a role can be added to a guild member.
 * @param roleId - The ID of the role to be added.
 * @param me - The guild member performing the action.
 * @returns A boolean indicating whether the role can be added to the member.
 */
export const canAddRoleToMember = (me: Discord.GuildMember, roleId: string) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageRoles) &&
 me.roles.highest.comparePositionTo(roleId) > 0;
