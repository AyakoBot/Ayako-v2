import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';

import { canPrune } from './beginPrune.js';
import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Get the number of members that would be removed in a prune operation.
 * @param guild - The guild to get the prune count for.
 * @param query - The query parameters for the prune operation.
 * @returns A promise that resolves with the number of members that
 * would be removed in the prune operation.
 */
export default async (guild: Discord.Guild, query?: Discord.RESTGetAPIGuildPruneCountQuery) => {
 if (!canPrune(await getBotMemberFromGuild(guild))) {
  const e = requestHandlerError(`Cannot get prune count`, [
   Discord.PermissionFlagsBits.KickMembers,
  ]);

  error(guild, e);
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).guilds.getPruneCount(guild.id, query).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
};
