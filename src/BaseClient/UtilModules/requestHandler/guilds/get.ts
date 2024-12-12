import * as Discord from 'discord.js';
import error from '../../error.js';

import { Guild } from '../../../Other/classes.js';
import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Retrieves a guild from the API using the provided guild ID and query parameters.
 *
 * @param guild - The Discord guild object.
 * @param guildId - The ID of the guild to retrieve.
 * @param query - The query parameters for the API request.
 * @returns A Promise that resolves to the retrieved guild object.
 */
export default async (
 guild: Discord.Guild,
 guildId: string,
 query: Discord.RESTGetAPIGuildQuery,
) => {
 if (query.with_counts !== true && guild.client.guilds.cache.get(guildId)) {
  return guild.client.guilds.cache.get(guildId) as Discord.Guild;
 }

 if (!canGet(await getBotMemberFromGuild(guild), guildId)) {
  const e = requestHandlerError(`Cannot get guild ${guild.name} / ${guild.id}`, []);

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (await getAPI(guild)).guilds
  .get(guildId, query)
  .then((g) => {
   const parsed = new Guild(guild.client, g);

   if (query.with_counts && guild.client.guilds.cache.get(parsed.id)) {
    guild.client.guilds.cache.get(parsed.id)!.approximateMemberCount =
     parsed.approximateMemberCount;

    guild.client.guilds.cache.get(parsed.id)!.approximatePresenceCount =
     parsed.approximatePresenceCount;

    parsed.memberCount = guild.client.guilds.cache.get(parsed.id)!.memberCount;
   }

   return parsed;
  })
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
};

/**
 * Checks if the given guild member has permission to get information about a guild.
 * @param me - The Discord guild member.
 * @param guildId - The ID of the guild.
 * @returns A boolean indicating whether the guild member has permission to get
 * information about the guild.
 */
export const canGet = (me: Discord.GuildMember, guildId: string) => {
 if (me.id === me.client.user.id && me.client.guilds.cache.has(guildId)) return true;

 const guild = me.client.guilds.cache.get(guildId);
 if (!guild) return false;

 if (!guild.members.cache.get(me.id)) return false;
 return true;
};
