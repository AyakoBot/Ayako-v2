import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Sets the positions of a batch of channels for a guild.
 * @param guild - The guild to set the channel positions for.
 * @param body - The JSON body containing the new positions of the channels.
 * @param reason - The reason for setting the channel positions (optional).
 * @returns A promise that resolves with the updated guild channel positions,
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPatchAPIGuildChannelPositionsJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .setChannelPositions(guild.id, body, { reason })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
