import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Deletes a scheduled event for a guild.
 * @param guild - The guild where the event is scheduled.
 * @param eventId - The ID of the scheduled event to delete.
 * @param reason - The reason for deleting the scheduled event.
 * @returns A promise that resolves with the deleted event, or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, eventId: string, reason?: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDeleteScheduledEvent(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot delete scheduled event ${eventId}`, [
   Discord.PermissionFlagsBits.ManageEvents,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds
  .deleteScheduledEvent(guild.id, eventId, { reason })
  .catch((e) => {
   error(guild, e);
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the necessary permissions to delete a scheduled event.
 * @param me - The Discord guild member.
 * @returns True if the guild member has the necessary permissions, false otherwise.
 */
export const canDeleteScheduledEvent = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.ManageEvents);
