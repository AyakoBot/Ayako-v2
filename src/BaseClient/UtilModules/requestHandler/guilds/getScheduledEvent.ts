import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Retrieves a scheduled event from the specified guild.
 * @param guild - The guild to retrieve the scheduled event from.
 * @param eventId - The ID of the scheduled event to retrieve.
 * @param query - Optional query parameters to include in the request.
 * @returns A Promise that resolves with the retrieved scheduled event, or rejects with an error.
 */
export default async (
 guild: Discord.Guild,
 eventId: string,
 query?: Discord.RESTGetAPIGuildScheduledEventQuery,
) =>
 (await getAPI(guild)).guilds
  .getScheduledEvent(guild.id, eventId, query)
  .then((e) => {
   const parsed = new Classes.GuildScheduledEvent(guild.client, e);
   if (guild.scheduledEvents.cache.get(parsed.id)) return parsed;
   guild.scheduledEvents.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
