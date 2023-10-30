import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Executes a webhook with the given parameters
 * and returns a Promise that resolves with a new Message object.
 * @param guild The guild where the webhook is executed.
 * @param webhookId The ID of the webhook to execute.
 * @param token The token of the webhook to execute.
 * @param body The body of the webhook to execute.
 * @returns A Promise that resolves with a new Message object.
 */
export default (
 guild: Discord.Guild,
 webhookId: string,
 token: string,
 body: Discord.RESTPostAPIWebhookWithTokenJSONBody &
  Discord.RESTPostAPIWebhookWithTokenQuery & {
   files?: Discord.RawFile[];
  },
) =>
 (cache.apis.get(guild.id) ?? API).webhooks
  .execute(webhookId, token, { ...body, wait: true })
  .then((m) => new Classes.Message(guild.client, m))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
