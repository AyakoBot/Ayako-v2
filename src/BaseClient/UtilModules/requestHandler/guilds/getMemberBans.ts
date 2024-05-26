import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import { canGetMemberBan } from './getMemberBan.js';
import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

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

 return (cache.apis.get(guild.id) ?? API).guilds
  .getMemberBans(guild.id, query)
  .then((bans) => {
   const parsed = bans.map((b) => new Classes.GuildBan(guild.client, b, guild));
   parsed.forEach((p) => {
    if (guild.bans.cache.get(p.user.id)) return;
    guild.bans.cache.set(p.user.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
