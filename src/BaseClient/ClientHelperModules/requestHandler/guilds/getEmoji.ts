import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves an emoji from the given guild by its ID.
 * @param guild - The guild to retrieve the emoji from.
 * @param emojiId - The ID of the emoji to retrieve.
 * @returns A Promise that resolves with the retrieved emoji, or rejects with an error.
 */
export default (guild: Discord.Guild, emojiId: string) =>
 guild.emojis.cache.get(emojiId) ??
 (cache.apis.get(guild.id) ?? API).guilds
  .getEmoji(guild.id, emojiId)
  .then((e) => {
   const parsed = new Classes.GuildEmoji(guild.client, e, guild);
   if (guild.emojis.cache.get(parsed.id)) return parsed;
   guild.emojis.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
