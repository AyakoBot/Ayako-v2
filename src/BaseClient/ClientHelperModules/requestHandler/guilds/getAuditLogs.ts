import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the audit logs for a given guild.
 * @param guild - The guild to retrieve the audit logs for.
 * @param query - Optional query parameters to filter the audit logs.
 * @returns A promise that resolves to a GuildAuditLogs object
 * representing the audit logs for the guild.
 */
export default (guild: Discord.Guild, query?: Discord.RESTGetAPIAuditLogQuery) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getAuditLogs(guild.id, query)
  .then((a) => new Classes.GuildAuditLogs(guild, a))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
