import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

const cacheSetter = (
 cacheItem: unknown,
 // eslint-disable-next-line @typescript-eslint/ban-types
 cacheSet: Function | undefined,
 item: unknown,
 key?: string,
) => {
 if (!cacheSet) return;
 if (!cacheItem) cacheSet(key ?? (item as { [key: string]: string }).id, item);
};

export default {
 getNitroStickers: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).stickers.getNitroStickers().catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 get: (guild: Discord.Guild, stickerId: string) =>
  (cache.apis.get(guild.id) ?? API).stickers
   .get(stickerId)
   .then((s) => {
    const parsed = new Classes.Sticker(guild.client, s);
    cacheSetter(guild.stickers.cache.get(parsed.id), guild.stickers.cache.set, parsed);
    return parsed;
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
};
