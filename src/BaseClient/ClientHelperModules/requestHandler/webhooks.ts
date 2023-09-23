import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

/**
 * Retrieves a webhook from the Discord API and returns a new instance of the `Webhook` class.
 * @param guild The guild where the webhook is located.
 * @param webhookId The ID of the webhook to retrieve.
 * @param token Optional token to use for authentication.
 * @returns A promise that resolves with a new instance of the `Webhook` class,
 * or rejects with a `DiscordAPIError`.
 */
const get = (guild: Discord.Guild, webhookId: string, token?: string) =>
 (cache.apis.get(guild.id) ?? API).webhooks
  .get(webhookId, { token })
  .then((w) => new Classes.Webhook(guild.client, w))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

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
const edit = async (
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
const del = (guild: Discord.Guild, webhookId: string, data?: { token?: string; reason?: string }) =>
 (cache.apis.get(guild.id) ?? API).webhooks.delete(webhookId, data).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Executes a webhook with the given parameters
 * and returns a Promise that resolves with a new Message object.
 * @param guild The guild where the webhook is executed.
 * @param webhookId The ID of the webhook to execute.
 * @param token The token of the webhook to execute.
 * @param body The body of the webhook to execute.
 * @returns A Promise that resolves with a new Message object.
 */
const execute = (
 guild: Discord.Guild,
 webhookId: string,
 token: string,
 body: Discord.RESTPostAPIWebhookWithTokenJSONBody &
  Discord.RESTPostAPIWebhookWithTokenQuery & {
   files?: Discord.RawFile[];
  },
) =>
 (cache.apis.get(guild.id) ?? API).webhooks
  .execute(webhookId, token, { ...body, wait: true })
  .then((m) => new Classes.Message(guild.client, m))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

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
const executeSlack = (
 guild: Discord.Guild,
 webhookId: string,
 token: string,
 body: unknown,
 query?: Discord.RESTPostAPIWebhookWithTokenSlackQuery,
) =>
 (cache.apis.get(guild.id) ?? API).webhooks
  .executeSlack(webhookId, token, body, query)
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });

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
const executeGitHub = (
 guild: Discord.Guild,
 webhookId: string,
 token: string,
 body: unknown,
 query?: Discord.RESTPostAPIWebhookWithTokenGitHubQuery,
) =>
 (cache.apis.get(guild.id) ?? API).webhooks
  .executeGitHub(webhookId, token, body, query)
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });

/**
 * Retrieves a message from a webhook.
 * @param guild - The guild where the webhook is located.
 * @param webhookId - The ID of the webhook.
 * @param token - The token of the webhook.
 * @param messageId - The ID of the message to retrieve.
 * @param query - Optional query parameters for the request.
 * @returns A Promise that resolves with a Message object or rejects with an error.
 */
const getMessage = (
 guild: Discord.Guild,
 webhookId: string,
 token: string,
 messageId: string,
 query?: Discord.RESTGetAPIWebhookWithTokenMessageQuery,
) =>
 (cache.apis.get(guild.id) ?? API).webhooks
  .getMessage(webhookId, token, messageId, query)
  .then((m) => new Classes.Message(guild.client, m))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e;
  });

/**
 * Edits a message sent by a webhook.
 * @param guild - The guild where the webhook is located.
 * @param webhookId - The ID of the webhook.
 * @param token - The token of the webhook.
 * @param messageId - The ID of the message to edit.
 * @param body - The new message content and options.
 * @returns A Promise that resolves with the edited message or rejects with an error.
 */
const editMessage = (
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

/**
 * Deletes a message sent through a webhook.
 * @param guild - The guild where the webhook is located.
 * @param webhookId - The ID of the webhook.
 * @param token - The token of the webhook.
 * @param messageId - The ID of the message to delete.
 * @param query - Optional query parameters.
 * @returns A promise that resolves with the deleted message or rejects with an error.
 */
const deleteMessage = (
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

/**
 * Helper methods for handling webhooks.
 * @property {Function} get
 * - Retrieves a webhook.
 * @property {Function} edit
 * - Edits a webhook.
 * @property {Function} delete
 * - Deletes a webhook.
 * @property {Function} execute
 * - Executes a webhook.
 * @property {Function} executeSlack
 * - Executes a Slack webhook.
 * @property {Function} executeGitHub
 * - Executes a GitHub webhook.
 * @property {Function} getMessage
 * - Retrieves a message from a webhook.
 * @property {Function} editMessage
 * - Edits a message from a webhook.
 * @property {Function} deleteMessage
 * - Deletes a message from a webhook.
 */
export default {
 get,
 edit,
 delete: del,
 execute,
 executeSlack,
 executeGitHub,
 getMessage,
 editMessage,
 deleteMessage,
};
