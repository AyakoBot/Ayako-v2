import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Edits a webhook.
 * @param guild - The guild where the webhook is located.
 * @param webhookId - The ID of the webhook to edit.
 * @param body - The new webhook data to set.
 * @param data - Optional additional data for the request.
 * @param data.token - The token to use for the request.
 * @param data.reason - The reason for the request.
 * @returns A promise that resolves with the edited webhook.
 */
export default async (
 guild: Discord.Guild,
 webhookId: string,
 body: Discord.RESTPatchAPIWebhookJSONBody,
 data?: { token?: string; reason?: string },
) =>
 (cache.apis.get(guild.id) ?? API).webhooks
  .edit(
   webhookId,
   {
    ...body,
    avatar: body.avatar ? await Discord.DataResolver.resolveImage(body.avatar) : body.avatar,
   },
   data,
  )
  .then((w) => new Classes.Webhook(guild.client, w))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
