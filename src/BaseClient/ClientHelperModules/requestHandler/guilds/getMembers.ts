import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves members from a guild.
 * @param guild - The guild to retrieve members from.
 * @param query - The query parameters for the API request.
 * @returns A promise that resolves with an array of GuildMember objects.
 */
export default (guild: Discord.Guild, query?: Discord.RESTGetAPIGuildMembersQuery) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getMembers(guild.id, query)
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
