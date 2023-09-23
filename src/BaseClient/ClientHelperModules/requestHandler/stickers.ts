import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

/**
 * Retrieves Nitro stickers for a given guild.
 * @param guild - The guild to retrieve Nitro stickers for.
 * @returns A promise that resolves with the Nitro stickers, or rejects with a DiscordAPIError.
 */
const getNitroStickers = (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).stickers.getNitroStickers().catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Retrieves a sticker from the cache or API.
 * @param guild The guild where the sticker is located.
 * @param stickerId The ID of the sticker to retrieve.
 * @returns A promise that resolves with the retrieved sticker, or rejects with an error.
 */
const get = async (guild: Discord.Guild, stickerId: string) =>
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
  });

/**
 * Sticker request handler module.
 * @property {Function} get
 * - Function to get a sticker.
 * @property {Function} getNitroStickers
 * - Function to get Nitro stickers.
 */
export default {
 get,
 getNitroStickers,
};
