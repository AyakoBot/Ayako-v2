import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves a list of archived threads in a channel.
 * @param channel - The channel to retrieve archived threads from.
 * @param status - The status of the threads to retrieve. Can be either 'private' or 'public'.
 * @param query - The query parameters to include in the request.
 * @returns A Promise that resolves with an array of parsed thread objects.
 */
export default async (
 channel: Discord.NewsChannel | Discord.TextChannel | Discord.ForumChannel,
 status: 'private' | 'public',
 query: Discord.RESTGetAPIChannelThreadsArchivedQuery,
) =>
 (channel.guild ? cache.apis.get(channel.guild.id) ?? API : API).channels
  .getArchivedThreads(channel.id, status, query)
  .then((res) => {
   const parsed = res.threads.map((t) => Classes.Channel<10>(channel.client, t, channel.guild));
   parsed.forEach((p) => {
    if (channel.threads.cache.get(p.id)) return;
    channel.threads.cache.set(
     p.id,
     p as Discord.ThreadChannel<true> & Discord.ThreadChannel<false>,
    );
   });
   return parsed;
  })
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
