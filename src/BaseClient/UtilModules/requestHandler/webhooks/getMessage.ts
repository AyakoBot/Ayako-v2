import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves a message from a webhook.
 * @param guild - The guild where the webhook is located.
 * @param webhookId - The ID of the webhook.
 * @param token - The token of the webhook.
 * @param messageId - The ID of the message to retrieve.
 * @param query - Optional query parameters for the request.
 * @returns A Promise that resolves with a Message object or rejects with an error.
 */
export default async (
 guild: Discord.Guild,
 webhookId: string,
 token: string,
 messageId: string,
 query?: Discord.RESTGetAPIWebhookWithTokenMessageQuery,
) =>
 (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).webhooks
  .getMessage(webhookId, token, messageId, query)
  .then((m) => new Classes.Message(guild.client, m))
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
