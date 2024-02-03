import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';

/**
 * Get the number of members that would be removed in a prune operation.
 * @param guild - The guild to get the prune count for.
 * @param query - The query parameters for the prune operation.
 * @returns A promise that resolves with the number of members that
 * would be removed in the prune operation.
 */
export default async (guild: Discord.Guild, query?: Discord.RESTGetAPIGuildPruneCountQuery) => {
 if (
  !guild.client.util.importCache.BaseClient.UtilModules.requestHandler.guilds.beginPrune.file.canPrune(
   await guild.client.util.getBotMemberFromGuild(guild),
  )
 ) {
  const e = guild.client.util.requestHandlerError(`Cannot get prune count`, [
   Discord.PermissionFlagsBits.KickMembers,
  ]);

  guild.client.util.error(guild, e);
  return e;
 }

 return (guild.client.util.cache.apis.get(guild.id) ?? API).guilds
  .getPruneCount(guild.id, query)
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
