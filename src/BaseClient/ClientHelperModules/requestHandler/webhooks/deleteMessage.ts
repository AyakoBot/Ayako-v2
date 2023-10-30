import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
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
export default (
 guild: Discord.Guild,
 webhookId: string,
 token: string,
 messageId: string,
 query?: { thread_id: string },
) =>
 (cache.apis.get(guild.id) ?? API).webhooks
  .deleteMessage(webhookId, token, messageId, query)
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
