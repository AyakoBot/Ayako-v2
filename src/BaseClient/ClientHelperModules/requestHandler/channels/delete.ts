import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Deletes a channel from the given guild.
 * @param guild - The guild where the channel is located.
 * @param channelId - The ID of the channel to delete.
 * @returns A promise that resolves with the deleted channel, or rejects with a DiscordAPIError.
 */
export default (guild: Discord.Guild, channelId: string) =>
 (cache.apis.get(guild.id) ?? API).channels
  .delete(channelId)
  .then((c) => Classes.Channel(guild.client, c, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
