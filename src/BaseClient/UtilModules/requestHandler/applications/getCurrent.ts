import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import error from '../../error.js';

/**
 * Gets the current Application.
 * @param guild The Guild to get the Application from.
 * @returns A Promise that resolves with a DiscordAPIError if the application cannot be found.
 */
export default async (guild?: Discord.Guild) =>
 (guild ? cache.apis.get(guild.id) ?? API : API).applications.getCurrent().catch((e) => {
  error(guild, e);
  return e as Discord.DiscordAPIError;
 });
