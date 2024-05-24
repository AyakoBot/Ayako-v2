import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves a sticker from the cache or the Discord API.
 * @param guild The guild where the sticker is located.
 * @param stickerId The ID of the sticker to retrieve.
 * @returns A Promise that resolves with the retrieved sticker, or rejects with an error.
 */
export default async (guild: Discord.Guild, stickerId: string) =>
 guild.stickers.cache.get(stickerId) ??
 (cache.apis.get(guild.id) ?? API).guilds
  .getSticker(guild.id, stickerId)
  .then((s) => {
   const parsed = new Classes.Sticker(guild.client, s);
   if (guild.stickers.cache.get(parsed.id)) return parsed;
   guild.stickers.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, e);
   return e as Discord.DiscordAPIError;
  });
