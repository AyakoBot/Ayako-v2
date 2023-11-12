import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Adds a role to a member in a guild.
 * @param guild - The guild where the member is in.
 * @param userId - The ID of the member to add the role to.
 * @param roleId - The ID of the role to add to the member.
 * @param reason - The reason for adding the role (optional).
 * @returns A promise that resolves with the updated member object if successful,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, userId: string, roleId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .addRoleToMember(guild.id, userId, roleId, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
