import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Begins pruning of inactive members in a guild.
 * @param guild - The guild to prune members from.
 * @param body - The JSON body to send with the prune request.
 * @param reason - The reason for beginning the prune.
 * @returns A promise that resolves with the result of the prune request,
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body?: Discord.RESTPostAPIGuildPruneJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds.beginPrune(guild.id, body, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
