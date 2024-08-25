import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Retrieves the widget for a given guild.
 * @param guild - The guild to retrieve the widget for.
 * @returns A promise that resolves with a new Widget instance if successful,
 * or rejects with a DiscordAPIError if unsuccessful.
 */
export default async (guild: Discord.Guild) =>
 (await getAPI(guild)).guilds
  .getWidget(guild.id)
  .then((w) => new Classes.Widget(guild.client, w))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
