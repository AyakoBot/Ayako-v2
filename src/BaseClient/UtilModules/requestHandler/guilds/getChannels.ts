import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Retrieves all channels in a guild and returns them as an array of parsed Channel objects.
 * If the channels are already cached, they are not added again.
 * @param guild - The guild to retrieve channels from.
 * @returns A Promise that resolves with an array of parsed Channel objects.
 */
export default async (guild: Discord.Guild) =>
 (await getAPI(guild)).guilds
  .getChannels(guild.id)
  .then((channels) => {
   const parsed = channels.map((c) => Classes.Channel(guild.client, c, guild));
   parsed.forEach((p) => {
    if (guild.channels.cache.get(p.id)) return;
    guild.channels.cache.set(p.id, p as Discord.GuildBasedChannel);
   });
   return parsed;
  })
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
