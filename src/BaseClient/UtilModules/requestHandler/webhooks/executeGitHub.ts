import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';

/**
 * Executes a GitHub webhook for a guild.
 * @param guild - The guild where the webhook is being executed.
 * @param webhookId - The ID of the webhook being executed.
 * @param token - The token for the webhook being executed.
 * @param body - The body of the webhook being executed.
 * @param query - Optional query parameters for the webhook being executed.
 * @returns A Promise that resolves with the result of the webhook execution,
 * or rejects with an error.
 */
export default async (
 guild: Discord.Guild,
 webhookId: string,
 token: string,
 body: unknown,
 query?: Discord.RESTPostAPIWebhookWithTokenGitHubQuery,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return (cache.apis.get(guild.id) ?? API).webhooks
  .executeGitHub(webhookId, token, body, query)
  .catch((e) => {
   error(guild, e);
   return e;
  });
};
