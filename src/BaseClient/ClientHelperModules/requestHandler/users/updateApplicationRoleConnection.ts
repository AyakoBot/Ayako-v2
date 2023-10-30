import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Updates the application role connection for the given guild.
 * @param guild - The guild to update the application role connection for.
 * @param applicationId - The ID of the application to update the role connection for.
 * @param body - The JSON body containing the updated role connection information.
 * @returns A promise that resolves with the updated role connection information,
 * or rejects with an error.
 */
export default (
 guild: Discord.Guild,
 applicationId: string,
 body: Discord.RESTPutAPICurrentUserApplicationRoleConnectionJSONBody,
) =>
 (cache.apis.get(guild.id) ?? API).users
  .updateApplicationRoleConnection(applicationId, body)
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
