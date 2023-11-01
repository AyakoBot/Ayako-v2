import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

/**
 * Deletes a webhook in a guild.
 * @param guild - The guild where the webhook is located.
 * @param webhookId - The ID of the webhook to delete.
 * @param data - Optional data to provide when deleting the webhook.
 * @param data.token - The webhook token to authenticate the request.
 * @param data.reason - The reason for deleting the webhook.
 * @returns A promise that resolves with the deleted webhook if successful,
 * or rejects with a DiscordAPIError if unsuccessful.
 */
export default async (
 guild: Discord.Guild,
 webhookId: string,
 data?: { token?: string; reason?: string },
) =>
 (cache.apis.get(guild.id) ?? API).webhooks.delete(webhookId, data).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
