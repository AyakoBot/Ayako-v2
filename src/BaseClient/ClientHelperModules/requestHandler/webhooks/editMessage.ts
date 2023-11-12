import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Edits a message sent by a webhook.
 * @param guild - The guild where the webhook is located.
 * @param webhookId - The ID of the webhook.
 * @param token - The token of the webhook.
 * @param messageId - The ID of the message to edit.
 * @param body - The new message content and options.
 * @returns A Promise that resolves with the edited message or rejects with an error.
 */
export default async (
 guild: Discord.Guild,
 webhookId: string,
 token: string,
 messageId: string,
 body: Discord.RESTPatchAPIWebhookWithTokenMessageJSONBody & {
  files?: Discord.RawFile[];
  thread_id?: string;
 },
) =>
 (cache.apis.get(guild.id) ?? API).webhooks
  .editMessage(webhookId, token, messageId, body)
  .then((m) => new Classes.Message(guild.client, m))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });
