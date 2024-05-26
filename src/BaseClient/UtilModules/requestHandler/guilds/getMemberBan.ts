import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Retrieves the ban for a given user in a guild.
 * @param guild - The guild to retrieve the ban from.
 * @param userId - The ID of the user to retrieve the ban for.
 * @returns A promise that resolves with the GuildBan object for the user,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, userId: string) => {
 if (!canGetMemberBan(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot get member ban`, [Discord.PermissionFlagsBits.BanMembers]);

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (
  guild.bans.cache.get(userId) ??
  (cache.apis.get(guild.id) ?? API).guilds
   .getMemberBan(guild.id, userId)
   .then((b) => {
    const parsed = new Classes.GuildBan(guild.client, b, guild);
    if (guild.bans.cache.get(parsed.user.id)) return parsed;
    guild.bans.cache.set(parsed.user.id, parsed);
    return parsed;
   })
   .catch((e) => e as Discord.DiscordAPIError)
 );
};

/**
 * Checks if the user has the necessary permissions to get a member's ban status.
 * @param me - The user's guild member object.
 * @returns True if the user has the "Ban Members" permission, false otherwise.
 */
export const canGetMemberBan = (me: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.BanMembers);
