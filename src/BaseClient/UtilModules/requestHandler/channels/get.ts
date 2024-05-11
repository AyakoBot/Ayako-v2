import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves a channel from the cache or the Discord API.
 * @param guild The guild that the channel belongs to.
 * @param id The ID of the channel to retrieve.
 * @returns A Promise that resolves with the retrieved channel.
 */
export default async <T extends Discord.Guild | undefined>(
 guild: T,
 id: string,
 client: T extends Discord.Guild ? undefined : Discord.Client,
) =>
 guild?.channels.cache.get(id) ??
 (guild ? cache.apis.get(guild.id) ?? API : API).channels
  .get(id)
  .then((c) => {
   const g = 'guild_id' in c && c.guild_id ? (guild?.client ?? client)!.guilds.cache.get(c.guild_id) : undefined;
   if (!g) return new Error('Trying to get a channel without a guild.');
   const parsed = Classes.Channel(g.client, c, g);

   if (g.channels.cache.get(parsed.id)) return parsed;
   if (![Discord.ChannelType.DM, Discord.ChannelType.GroupDM].includes(parsed.type)) {
    g.channels.cache.set(parsed.id, parsed as Discord.GuildBasedChannel);
   }

   return parsed;
  })
  .catch((e) => {
   if (guild) error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
