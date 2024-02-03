import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';

/**
 * Deletes a message sent through a webhook.
 * @param guild - The guild where the webhook is located.
 * @param webhookId - The ID of the webhook.
 * @param token - The token of the webhook.
 * @param messageId - The ID of the message to delete.
 * @param query - Optional query parameters.
 * @returns A promise that resolves with the deleted message or rejects with an error.
 */
export default async (
 guild: Discord.Guild,
 webhookId: string,
 token: string,
 messageId: string,
 query?: { thread_id: string },
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return (guild.client.util.cache.apis.get(guild.id) ?? API).webhooks
  .deleteMessage(webhookId, token, messageId, query)
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
};
