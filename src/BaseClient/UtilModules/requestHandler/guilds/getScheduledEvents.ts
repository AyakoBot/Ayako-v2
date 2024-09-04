import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Retrieves scheduled events for a given guild.
 * @param guild - The guild to retrieve scheduled events for.
 * @returns A promise that resolves with an array of parsed scheduled events.
 */
export default async (guild: Discord.Guild) =>
 (await getAPI(guild)).guilds
  .getScheduledEvents(guild.id)
  .then((events) => {
   const parsed = events.map((e) => new Classes.GuildScheduledEvent(guild.client, e));
   parsed.forEach((p) => {
    if (guild.scheduledEvents.cache.get(p.id)) return;
    guild.scheduledEvents.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
