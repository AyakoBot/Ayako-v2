import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Searches for members in a guild based on the provided query.
 * @param guild - The guild to search in.
 * @param query - The query to use for searching.
 * @returns A Promise that resolves to an array of GuildMember objects that match the search query.
 */
export default async (guild: Discord.Guild, query: Discord.RESTGetAPIGuildMembersSearchQuery) =>
 (await getAPI(guild)).guilds
  .searchForMembers(guild.id, query)
  .then((members) => {
   const parsed = members.map((m) => new Classes.GuildMember(guild.client, m, guild));
   parsed.forEach((p) => {
    if (guild.members.cache.get(p.id)) return;
    guild.members.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
