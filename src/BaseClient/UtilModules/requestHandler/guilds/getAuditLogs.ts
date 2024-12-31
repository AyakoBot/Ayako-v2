import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';

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

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (await getAPI(guild)).guilds
  .getAuditLogs(guild.id, query)
  .then((a) => {
   const logs = new Classes.GuildAuditLogs(guild, a);

   a.audit_log_entries.forEach((entry) => {
    switch (entry.action_type as number) {
     case 192: {
      const parsedEntry = logs.entries.find((e) => e.id === entry.id);
      if (!parsedEntry) break;

      // TODO: Wait for djs to support 192 193
      // @ts-ignore
      parsedEntry.extra = entry.options;
      break;
     }
     default:
      break;
    }
   });

   return logs;
  })
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
};

/**
 * Checks if the given guild member has permission to view audit logs.
 * @param me - The guild member to check.
 * @returns True if the guild member has permission to view audit logs, false otherwise.
 */
export const canViewAuditLogs = (me: Discord.GuildMember) =>
 me.permissions?.has(Discord.PermissionFlagsBits.ViewAuditLog);
