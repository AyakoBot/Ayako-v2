import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

/**
 * Executes a Slack webhook with the given parameters.
 * @param guild - The Discord guild where the webhook is being executed.
 * @param webhookId - The ID of the Slack webhook.
 * @param token - The token for the Slack webhook.
 * @param body - The body of the request being sent to the Slack webhook.
 * @param query - Optional query parameters to include in the request.
 * @returns A Promise that resolves with the result of the webhook execution,
 * or rejects with an error.
 */
export default async (
 guild: Discord.Guild,
 webhookId: string,
 token: string,
 body: unknown,
 query?: Discord.RESTPostAPIWebhookWithTokenSlackQuery,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return (
  guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)
 ).webhooks
  .executeSlack(webhookId, token, body, query)
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
};
