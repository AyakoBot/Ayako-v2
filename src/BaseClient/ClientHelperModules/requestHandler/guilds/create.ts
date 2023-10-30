import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Creates a new guild.
 * @param guild The guild to create the new guild in.
 * @param body The JSON body of the request.
 * @returns A promise that resolves with the newly created guild or rejects with a DiscordAPIError.
 */
export default (guild: Discord.Guild, body: Discord.RESTPostAPIGuildsJSONBody) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .create(body)
  .then((g) => new Classes.Guild(guild.client, g))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
