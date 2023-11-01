import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Removes a role from a member in a guild.
 * @param guild - The guild where the member is in.
 * @param userId - The ID of the member to remove the role from.
 * @param roleId - The ID of the role to remove from the member.
 * @param reason - The reason for removing the role (optional).
 * @returns A promise that resolves with the removed role or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, userId: string, roleId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .removeRoleFromMember(guild.id, userId, roleId, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
