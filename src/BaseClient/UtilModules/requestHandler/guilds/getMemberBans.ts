import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves a list of bans for the specified guild.
 * @param guild - The guild to retrieve the bans for.
 * @param query - An optional query to filter the results.
 * @returns A promise that resolves with an array of GuildBan objects.
 */
export default async (guild: Discord.Guild, query?: Discord.RESTGetAPIGuildBansQuery) => {
 if (
  !guild.client.util.importCache.BaseClient.UtilModules.requestHandler.guilds.getMemberBan.file.canGetMemberBan(
   await guild.client.util.getBotMemberFromGuild(guild),
  )
 ) {
  const e = guild.client.util.requestHandlerError(`Cannot get member bans`, [
   Discord.PermissionFlagsBits.BanMembers,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).guilds
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
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
