import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves the webhooks for a given guild.
 * @param guild The guild to retrieve the webhooks for.
 * @returns A promise that resolves with an array of Webhook objects.
 */
export default async (guild: Discord.Guild) =>
 (cache.apis.get(guild.id) ?? API).guilds
  .getWebhooks(guild.id)
  .then((webhooks) => webhooks.map((w) => new Classes.Webhook(guild.client, w)))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
