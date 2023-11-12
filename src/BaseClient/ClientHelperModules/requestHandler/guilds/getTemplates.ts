import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the templates for a given guild.
 * @param guild - The guild to retrieve templates for.
 * @returns A promise that resolves with an array of GuildTemplate objects.
 */
export default async (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getTemplates(guild.id)
  .then((templates) => templates.map((t) => new Classes.GuildTemplate(guild.client, t)))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
