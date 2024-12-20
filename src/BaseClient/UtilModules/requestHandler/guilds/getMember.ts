import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import { getAPI } from '../channels/addReaction.js';
import { API } from '../../../Bot/Client.js';

/**
 * Retrieves a member from a guild by their user ID.
 * @param guild The guild to retrieve the member from, undefined if no custom API should be used
 * @param userId The ID of the user to retrieve.
 * @param saveGuild - The guild to use if guild is not defined.
 * @returns A Promise that resolves with the GuildMember object,
 * or rejects with a DiscordAPIError if an error occurs.
 */
function fn(
 guild: undefined | null | Discord.Guild,
 userId: string,
 saveGuild: Discord.Guild,
 forceMainAPI?: boolean,
): Promise<Discord.GuildMember | Discord.DiscordAPIError | Error>;
function fn(
 guild: Discord.Guild,
 userId: string,
 saveGuild?: undefined,
 forceMainAPI?: boolean,
): Promise<Discord.GuildMember | Discord.DiscordAPIError | Error>;
async function fn(
 guild: undefined | null | Discord.Guild,
 userId: string,
 saveGuild?: Discord.Guild,
 forceMainAPI: boolean = false,
): Promise<Discord.GuildMember | Discord.DiscordAPIError | Error> {
 const g = (guild ?? saveGuild)!;
 if (!g) return new Error('guild is not defined');

 return (
  g.members.cache.get(userId) ??
  (forceMainAPI ? API : await getAPI(guild)).guilds
   .getMember(g.id, userId)
   .then((m) => {
    const parsed = new Classes.GuildMember(g.client, m as Discord.APIGuildMember, (guild ?? g)!);
    if (g.members.cache.get(parsed.id)) return parsed;
    g.members.cache.set(parsed.id, parsed);
    return parsed;
   })
   .catch((e: Discord.DiscordAPIError) => e as Discord.DiscordAPIError)
 );
}

export default fn;
