import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Deletes a scheduled event for a guild.
 * @param guild - The guild where the event is scheduled.
 * @param eventId - The ID of the scheduled event to delete.
 * @param reason - The reason for deleting the scheduled event.
 * @returns A promise that resolves with the deleted event, or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, eventId: string, reason?: string) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .deleteScheduledEvent(guild.id, eventId, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
