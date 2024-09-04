import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Retrieves a sticker from the cache or the Discord API.
 * @param guild The guild where the sticker is located.
 * @param stickerId The ID of the sticker to retrieve.
 * @returns A Promise that resolves with the retrieved sticker, or rejects with an error.
 */
export default async (guild: Discord.Guild, stickerId: string) =>
 guild.stickers.cache.get(stickerId) ??
 (await getAPI(guild)).guilds
  .getSticker(guild.id, stickerId)
  .then((s) => {
   const parsed = new Classes.Sticker(guild.client, s);
   if (guild.stickers.cache.get(parsed.id)) return parsed;
   guild.stickers.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e: Discord.DiscordAPIError) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
