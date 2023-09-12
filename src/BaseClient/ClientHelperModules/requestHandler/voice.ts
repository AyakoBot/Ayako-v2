import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

export default {
 getVoiceRegions: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).voice
   .getVoiceRegions()
   .then((regions) => regions.map((r) => new Classes.VoiceRegion(r)))
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
};
