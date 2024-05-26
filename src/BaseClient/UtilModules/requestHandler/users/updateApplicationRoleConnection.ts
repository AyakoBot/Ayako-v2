import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import error from '../../error.js';

/**
 * Updates the application role connection for the given guild.
 * @param guild - The guild to update the application role connection for.
 * @param applicationId - The ID of the application to update the role connection for.
 * @param body - The JSON body containing the updated role connection information.
 * @returns A promise that resolves with the updated role connection information,
 * or rejects with an error.
 */
async function fn(
 guild: undefined | null | Discord.Guild,
 applicationId: string,
 body: Discord.RESTPutAPICurrentUserApplicationRoleConnectionJSONBody,
): Promise<Discord.APIApplicationRoleConnection | Discord.DiscordAPIError | Error> {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return ((guild ? cache.apis.get(guild.id) : undefined) ?? API).users
  .updateApplicationRoleConnection(applicationId, body)
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
}

export default fn;
