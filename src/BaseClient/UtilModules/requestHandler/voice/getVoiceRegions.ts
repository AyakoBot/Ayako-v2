import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the available voice regions for a given guild.
 * @param guild - The guild to retrieve the voice regions for.
 * @returns A promise that resolves with an array of available voice regions.
 */
export default async (guild?: Discord.Guild) =>
 ((guild ? cache.apis.get(guild.id) : undefined) ?? API).voice
  .getVoiceRegions()
  .then((regions) => regions.map((r) => new Classes.VoiceRegion(r)))
  .catch((e) => {
   error(guild, e);
   return e as Discord.DiscordAPIError;
  });
