import * as Discord from 'discord.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';

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

 if (!canAddRoleToMember(roleId, await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot add role to member`, [
   Discord.PermissionFlagsBits.ManageRoles,
  ]);

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (await getAPI(guild)).guilds
  .addRoleToMember(guild.id, userId, roleId, { reason })
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
};

/**
 * Checks if a role can be added to a guild member.
 * @param roleId - The ID of the role to be added.
 * @param me - The guild member performing the action.
 * @returns A boolean indicating whether the role can be added to the member.
 */
export const canAddRoleToMember = (roleId: string, me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageRoles) &&
 me.roles.highest.comparePositionTo(roleId) > 0;
