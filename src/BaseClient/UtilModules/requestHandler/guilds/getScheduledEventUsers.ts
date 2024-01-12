import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the users for a scheduled event in a guild.
 * @param guild The guild to retrieve the scheduled event users from.
 * @param eventId The ID of the scheduled event to retrieve the users for.
 * @param query Optional query parameters for the API request.
 * @returns A Promise that resolves with an array of objects containing the user
 * and member objects for each user in the scheduled event.
 */
export default async (
 guild: Discord.Guild,
 eventId: string,
 query?: Discord.RESTGetAPIGuildScheduledEventUsersQuery,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getScheduledEventUsers(guild.id, eventId, query)
  .then((users) => {
   const parsed = users.map((u) => ({
    user: new Classes.User(guild.client, u.user),
    member: u.member ? new Classes.GuildMember(guild.client, u.member, guild) : undefined,
   }));
   parsed.forEach((p) => {
    const user = () => {
     if (guild.client.users.cache.get(p.user.id)) return;
     guild.client.users.cache.set(p.user.id, p.user);
    };
    const member = () => {
     if (!p.member || guild.members.cache.get(p.member.id)) return;
     guild.members.cache.set(p.member.id, p.member);
    };

    user();
    if (p.member) member();
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
