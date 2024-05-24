import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';

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

 return (cache.apis.get(guild.id) ?? API).webhooks
  .deleteMessage(webhookId, token, messageId, query)
  .catch((e) => {
   error(guild, e);
   return e;
  });
};
