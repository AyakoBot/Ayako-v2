import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';

/**
 * Get the widget image of a guild with the specified style.
 * @param guild - The guild to get the widget image for.
 * @param style - The style of the widget image.
 * @returns A Promise that resolves with the widget image, or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, style?: Discord.GuildWidgetStyle) =>
 (cache.apis.get(guild.id) ?? API).guilds.getWidgetImage(guild.id, style).catch((e) => {
  error(guild, e);
  return e as Discord.DiscordAPIError;
 });
