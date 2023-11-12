import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Creates a new channel in the specified guild.
 * @param guild The guild where the channel will be created.
 * @param body The channel data to be sent to the API.
 * @param reason The reason for creating the channel.
 * @returns A promise that resolves with the created channel or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIGuildChannelJSONBody,
 reason?: string,
) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .createChannel(guild.id, body, { reason })
  .then((c) => Classes.Channel(guild.client, c, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
