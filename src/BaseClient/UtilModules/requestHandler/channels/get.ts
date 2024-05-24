import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

type Response = Promise<
 | Discord.DMChannel
 | Discord.BaseGuildVoiceChannel
 | Discord.ThreadChannel<boolean>
 | Discord.GuildBasedChannel
 | Discord.DiscordAPIError
>;

/**
 * Retrieves a channel from the cache or the Discord API.
 * @param guild The guild that the channel belongs to.
 * @param id The ID of the channel to retrieve.
 * @returns A Promise that resolves with the retrieved channel.
 */
function fn(guild: Discord.Guild, id: string, client: Discord.Client<true>): Response;
function fn(guild: Discord.Guild, id: string, client?: undefined): Response;
async function fn(guild: Discord.Guild, id: string, client?: Discord.Client<true>): Response {
 const c = (guild?.client ?? client)!;

 return (
  guild?.channels.cache.get(id) ??
  (guild ? cache.apis.get(guild.id) ?? API : API).channels
   .get(id)
   .then((channel) => {
    const parsed = Classes.Channel(c, channel, guild);

    if (guild.channels.cache.get(parsed.id)) return parsed;
    if (![Discord.ChannelType.DM, Discord.ChannelType.GroupDM].includes(parsed.type)) {
     guild.channels.cache.set(parsed.id, parsed as Discord.GuildBasedChannel);
    }

    return parsed;
   })
   .catch((e) => {
    error(guild, e);
    return e as Discord.DiscordAPIError;
   })
 );
}

export default fn;
