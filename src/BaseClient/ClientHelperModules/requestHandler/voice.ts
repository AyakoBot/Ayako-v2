import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

/**
 * Retrieves the available voice regions for a given guild.
 * @param guild - The guild to retrieve the voice regions for.
 * @returns A promise that resolves with an array of available voice regions.
 */
const getVoiceRegions = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).voice
  .getVoiceRegions()
  .then((regions) => regions.map((r) => new Classes.VoiceRegion(r)))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Helper module for handling voice-related requests.
 * @property {Function} getVoiceRegions
 * - Retrieves an array of available voice regions.
 */
export default {
 getVoiceRegions,
};
