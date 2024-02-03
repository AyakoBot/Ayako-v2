import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves a channel from the cache or the Discord API.
 * @param guild The guild that the channel belongs to.
 * @param id The ID of the channel to retrieve.
 * @returns A Promise that resolves with the retrieved channel.
 */
export default async (guild: Discord.Guild, id: string) =>
 guild.channels.cache.get(id) ??
 (guild ? guild.client.util.cache.apis.get(guild.id) ?? API : API).channels
  .get(id)
  .then((c) => {
   const parsed = Classes.Channel(guild.client, c, guild);

   if (guild.channels.cache.get(parsed.id)) return parsed;
   if (![Discord.ChannelType.DM, Discord.ChannelType.GroupDM].includes(parsed.type)) {
    guild.channels.cache.set(parsed.id, parsed as Discord.GuildBasedChannel);
   }

   return parsed;
  })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
