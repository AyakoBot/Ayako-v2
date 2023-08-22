import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';

export default {
 getVoiceRegions: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).voice.getVoiceRegions().catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
};
