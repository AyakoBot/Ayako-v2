import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

interface StartForumThreadOptions extends Discord.RESTPostAPIGuildForumThreadsJSONBody {
 message: Discord.RESTPostAPIGuildForumThreadsJSONBody['message'] & {
  files?: Discord.RawFile[];
 };
}

/**
 * Creates a new forum thread in the specified channel.
 * @param channel - The forum channel where the thread will be created.
 * @param body - The options for the new forum thread.
 * @returns A promise that resolves with the newly created forum thread channel.
 */
export default (channel: Discord.ForumChannel, body: StartForumThreadOptions) =>
 (cache.apis.get(channel.guild.id) ?? API).channels
  .createForumThread(channel.id, body)
  .then((t) => Classes.Channel(channel.client, t, channel.guild))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
