import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

const guilds = new Set<string>();

/**
 * Retrieves members from a guild.
 * @param guild - The guild to retrieve members from.
 * @param query - The query parameters for the API request.
 * @returns A promise that resolves with an array of GuildMember objects.
 */
export default async (guild: Discord.Guild, query?: Discord.RESTGetAPIGuildMembersQuery) => {
 if (guild.members.cache.size === guild.memberCount) return guild.members.cache.map((m) => m); 
 if (guilds.has(guild.id)) return [];
 guilds.add(guild.id);

 return (await getAPI(guild)).guilds
  .getMembers(guild.id, query)
  .then((members) => {
   const parsed = members.map((m) => new Classes.GuildMember(guild.client, m, guild));
   parsed.forEach((p) => {
    if (guild.members.cache.get(p.id)) return;
    guild.members.cache.set(p.id, p);
   });

   guilds.delete(guild.id);
   return parsed;
  })
  .catch((e) => {
   guilds.delete(guild.id);
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
}
