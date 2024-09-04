import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';
import { canGetMemberBan } from './getMemberBan.js';

/**
 * Retrieves a list of bans for the specified guild.
 * @param guild - The guild to retrieve the bans for.
 * @param query - An optional query to filter the results.
 * @returns A promise that resolves with an array of GuildBan objects.
 */
export default async (guild: Discord.Guild, query?: Discord.RESTGetAPIGuildBansQuery) => {
 if (!canGetMemberBan(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot get member bans`, [Discord.PermissionFlagsBits.BanMembers]);

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (await getAPI(guild)).guilds
  .getMemberBans(guild.id, query)
  .then((bans) => {
   const parsed = bans.map((b) => new Classes.GuildBan(guild.client, b, guild));
   parsed.forEach((p) => {
    if (guild.bans.cache.get(p.user.id)) return;
    guild.bans.cache.set(p.user.id, p);
   });
   return parsed;
  })
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
};
