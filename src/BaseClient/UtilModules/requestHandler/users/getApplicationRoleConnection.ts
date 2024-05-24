import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import error from '../../error.js';

/**
 * Returns the application role connection for the given application ID in the specified guild.
 * If the guild has an API cache, it will be used, otherwise the default API will be used.
 * @param guild - The guild to get the application role connection from.
 * @param applicationId - The ID of the application to get the role connection for.
 * @returns A promise that resolves to the application role connection,
 * or rejects with a DiscordAPIError.
 */
async function fn(
 guild: undefined | null | Discord.Guild,
 applicationId: string,
): Promise<Discord.APIApplicationRoleConnection | Discord.DiscordAPIError> {
 return ((guild ? cache.apis.get(guild.id) : undefined) ?? API).users
  .getApplicationRoleConnection(applicationId)
  .catch((e) => {
   error(guild, e);
   return e as Discord.DiscordAPIError;
  });
}

export default fn;
