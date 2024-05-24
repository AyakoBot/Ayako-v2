import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Returns the preview of a guild.
 * @param guild - The guild to get the preview for.
 * @returns A promise that resolves with the guild preview.
 */
export default async (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getPreview(guild.id)
  .then((p) => new Classes.GuildPreview(guild.client, p))
  .catch((e) => {
   error(guild, e);
   return e as Discord.DiscordAPIError;
  });
