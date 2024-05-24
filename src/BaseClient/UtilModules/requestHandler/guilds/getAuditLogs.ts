import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Retrieves the audit logs for a given guild.
 * @param guild - The guild to retrieve the audit logs for.
 * @param query - Optional query parameters to filter the audit logs.
 * @returns A promise that resolves to a GuildAuditLogs object
 * representing the audit logs for the guild.
 */
export default async (guild: Discord.Guild, query?: Discord.RESTGetAPIAuditLogQuery) => {
 if (!canViewAuditLogs(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot view audit logs`, [
   Discord.PermissionFlagsBits.ViewAuditLog,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .getAuditLogs(guild.id, query)
  .then((a) => new Classes.GuildAuditLogs(guild, a))
  .catch((e) => {
   error(guild, e);
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has permission to view audit logs.
 * @param me - The guild member to check.
 * @returns True if the guild member has permission to view audit logs, false otherwise.
 */
export const canViewAuditLogs = (me: Discord.GuildMember) =>
 me.permissions?.has(Discord.PermissionFlagsBits.ViewAuditLog);
