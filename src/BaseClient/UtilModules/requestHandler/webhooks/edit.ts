import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Edits a webhook.
 * @param guild - The guild where the webhook is located.
 * @param webhook - The webhook to edit.
 * @param body - The new webhook data to set.
 * @param data - Optional additional data for the request.
 * @returns A promise that resolves with the edited webhook.
 */
export default async (
 guild: Discord.Guild,
 webhook: Discord.Webhook,
 body: Discord.RESTPatchAPIWebhookJSONBody,
 data?: { token?: string; reason?: string },
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEdit(await getBotMemberFromGuild(guild), webhook)) {
  const e = requestHandlerError(`Cannot edit webhook ${webhook.id}`, [
   Discord.PermissionFlagsBits.ManageWebhooks,
  ]);

  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e;
 }

 return (cache.apis.get(guild.id) ?? API).webhooks
  .edit(
   webhook.id,
   {
    ...body,
    avatar: body.avatar ? await Discord.resolveImage(body.avatar) : body.avatar,
   },
   { ...data, token: webhook.token ?? data?.token },
  )
  .then((w) => new Classes.Webhook(guild.client, w))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Edits a webhook.
 * @param guild - The guild where the webhook is located.
 * @param webhook - The webhook to edit.
 */
export const canEdit = (me: Discord.GuildMember, webhook: Discord.Webhook) =>
 !webhook.token
  ? true
  : me.permissions.has(Discord.PermissionFlagsBits.ManageWebhooks) ||
    me.permissionsIn(webhook.channelId).has(Discord.PermissionFlagsBits.ManageWebhooks);
