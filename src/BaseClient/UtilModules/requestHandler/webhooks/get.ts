import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves a webhook from the Discord API and returns a new instance of the `Webhook` class.
 * @param guild The guild where the webhook is located.
 * @param webhookId The ID of the webhook to retrieve.
 * @param token Optional token to use for authentication.
 * @returns A promise that resolves with a new instance of the `Webhook` class,
 * or rejects with a `DiscordAPIError`.
 */
export default async (guild: Discord.Guild, webhookId: string, token?: string) =>
 (cache.apis.get(guild.id) ?? API).webhooks
  .get(webhookId, { token })
  .then((w) => new Classes.Webhook(guild.client, w))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
