import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Retrieves active threads for a given guild.
 * @param guild - The guild to retrieve active threads for.
 * @returns A promise that resolves with an array of parsed thread channels.
 */
export default async (guild: Discord.Guild) =>
 (await getAPI(guild)).guilds
  .getActiveThreads(guild.id)
  .then((threads) => {
   const parsed = threads.threads.map((t) => Classes.Channel<10>(guild.client, t, guild));
   parsed.forEach((p) => {
    if (p.parent?.threads.cache.get(p.id)) return;
    p.parent?.threads.cache.set(p.id, p as any);
   });
   return parsed;
  })
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
