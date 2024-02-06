import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Get the widget image of a guild with the specified style.
 * @param guild - The guild to get the widget image for.
 * @param style - The style of the widget image.
 * @returns A Promise that resolves with the widget image, or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, style?: Discord.GuildWidgetStyle) =>
 (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).guilds
  .getWidgetImage(guild.id, style)
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
