import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the welcome screen for a guild.
 * @param guild - The guild to retrieve the welcome screen for.
 * @returns A Promise that resolves with a new WelcomeScreen instance if successful,
 * or rejects with a DiscordAPIError if unsuccessful.
 */
export default async (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getWelcomeScreen(guild.id)
  .then((w) => new Classes.WelcomeScreen(guild, w))
  .catch((e) => {
   if (e.code === 10069) return undefined;
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
