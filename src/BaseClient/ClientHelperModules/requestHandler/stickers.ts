import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

export default {
 getNitroStickers: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).stickers.getNitroStickers().catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 get: (guild: Discord.Guild, stickerId: string) =>
  guild.stickers.cache.get(stickerId) ??
  (cache.apis.get(guild.id) ?? API).stickers
   .get(stickerId)
   .then((s) => {
    const parsed = new Classes.Sticker(guild.client, s);
    if (guild.stickers.cache.get(parsed.id)) return parsed;
    guild.stickers.cache.set(parsed.id, parsed);
    return parsed;
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
};
