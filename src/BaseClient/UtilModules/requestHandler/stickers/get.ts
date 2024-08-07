import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves a sticker from the cache or API.
 * @param guild The guild where the sticker is located.
 * @param stickerId The ID of the sticker to retrieve.
 * @returns A promise that resolves with the retrieved sticker, or rejects with an error.
 */
export default async <T extends Discord.Guild | null>(
 guild: T,
 stickerId: string,
 client: T extends null ? Discord.Client<true> : undefined,
) =>
 guild?.stickers.cache.get(stickerId) ??
 ((guild ? cache.apis.get(guild.id) : API) ?? API).stickers
  .get(stickerId)
  .then((s) => {
   const parsed = new Classes.Sticker((guild?.client ?? client)!, s);
   if (guild?.stickers.cache.get(parsed.id)) return parsed;
   guild?.stickers.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
