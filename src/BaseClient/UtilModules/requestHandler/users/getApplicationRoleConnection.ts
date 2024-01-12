import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';

/**
 * Returns the application role connection for the given application ID in the specified guild.
 * If the guild has an API cache, it will be used, otherwise the default API will be used.
 * @param guild - The guild to get the application role connection from.
 * @param applicationId - The ID of the application to get the role connection for.
 * @returns A promise that resolves to the application role connection,
 * or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, applicationId: string) =>
 (cache.apis.get(guild.id) ?? API).users.getApplicationRoleConnection(applicationId).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
