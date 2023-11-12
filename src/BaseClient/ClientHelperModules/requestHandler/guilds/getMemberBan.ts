import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the ban for a given user in a guild.
 * @param guild - The guild to retrieve the ban from.
 * @param userId - The ID of the user to retrieve the ban for.
 * @returns A promise that resolves with the GuildBan object for the user,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, userId: string) =>
 guild.bans.cache.get(userId) ??
 (cache.apis.get(guild.id) ?? API).guilds
  .getMemberBan(guild.id, userId)
  .then((b) => {
   const parsed = new Classes.GuildBan(guild.client, b, guild);
   if (guild.bans.cache.get(parsed.user.id)) return parsed;
   guild.bans.cache.set(parsed.user.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
