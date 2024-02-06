import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the stickers for a given guild.
 * @param guild The guild to retrieve the stickers for.
 * @returns A Promise that resolves with an array of parsed Sticker objects.
 */
export default async (guild: Discord.Guild) =>
 (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).guilds
  .getStickers(guild.id)
  .then((stickers) => {
   const parsed = stickers.map((s) => new Classes.Sticker(guild.client, s));
   parsed.forEach((p) => {
    if (guild.stickers.cache.get(p.id)) return;
    guild.stickers.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
