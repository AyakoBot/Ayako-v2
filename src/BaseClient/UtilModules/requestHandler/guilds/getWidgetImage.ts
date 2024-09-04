import * as Discord from 'discord.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Get the widget image of a guild with the specified style.
 * @param guild - The guild to get the widget image for.
 * @param style - The style of the widget image.
 * @returns A Promise that resolves with the widget image, or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, style?: Discord.GuildWidgetStyle) =>
 (await getAPI(guild)).guilds.getWidgetImage(guild.id, style).catch((e: Discord.DiscordAPIError) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 });
