import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the onboarding data for a given guild.
 * @param guild - The guild to retrieve onboarding data for.
 * @returns A promise that resolves with a new instance of the GuildOnboarding class.
 */
export default async (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getOnboarding(guild.id)
  .then((o) => new Classes.GuildOnboarding(guild.client, o))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
