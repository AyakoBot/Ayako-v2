import * as Discord from 'discord.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';
import { canPrune } from './beginPrune.js';

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

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (await getAPI(guild)).guilds.getPruneCount(guild.id, query).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
};
