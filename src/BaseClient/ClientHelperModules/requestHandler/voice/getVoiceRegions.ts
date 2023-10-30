import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the available voice regions for a given guild.
 * @param guild - The guild to retrieve the voice regions for.
 * @returns A promise that resolves with an array of available voice regions.
 */
export default (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).voice
  .getVoiceRegions()
  .then((regions) => regions.map((r) => new Classes.VoiceRegion(r)))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
