import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Fetches the emojis of a guild and adds them to the guild's cache.
 * If the guild's emojis are already in the cache, it returns them from the cache.
 * @param guild - The guild to fetch the emojis for.
 * @returns A promise that resolves with an array of GuildEmoji objects.
 */
export default async (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getEmojis(guild.id)
  .then((emojis) => {
   const parsed = emojis.map((e) => new Classes.GuildEmoji(guild.client, e, guild));
   parsed.forEach((p) => {
    if (guild.emojis.cache.get(p.id)) return;
    guild.emojis.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
