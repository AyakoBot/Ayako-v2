import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Deletes a role from a guild.
 * @param guild - The guild where the role will be deleted.
 * @param roleId - The ID of the role to be deleted.
 * @param reason - The reason for deleting the role.
 * @returns A promise that resolves with the deleted role,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, roleId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).guilds.deleteRole(guild.id, roleId, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
