import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves active threads for a given guild.
 * @param guild - The guild to retrieve active threads for.
 * @returns A promise that resolves with an array of parsed thread channels.
 */
export default async (guild: Discord.Guild) =>
 (guild.client.util.cache.apis.get(guild.id) ?? API).guilds
  .getActiveThreads(guild.id)
  .then((threads) => {
   const parsed = threads.threads.map((t) => Classes.Channel<10>(guild.client, t, guild));
   parsed.forEach((p) => {
    if (p.parent?.threads.cache.get(p.id)) return;
    p.parent?.threads.cache.set(
     p.id,
     p as Discord.ThreadChannel<true> & Discord.ThreadChannel<false>,
    );
   });
   return parsed;
  })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
