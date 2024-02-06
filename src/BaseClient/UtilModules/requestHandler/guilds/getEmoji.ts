import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves an emoji from the given guild by its ID.
 * @param guild - The guild to retrieve the emoji from.
 * @param emojiId - The ID of the emoji to retrieve.
 * @returns A Promise that resolves with the retrieved emoji, or rejects with an error.
 */
export default async (guild: Discord.Guild, emojiId: string) =>
 guild.emojis.cache.get(emojiId) ??
 (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).guilds
  .getEmoji(guild.id, emojiId)
  .then((e) => {
   const parsed = new Classes.GuildEmoji(guild.client, e, guild);
   if (guild.emojis.cache.get(parsed.id)) return parsed;
   guild.emojis.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
