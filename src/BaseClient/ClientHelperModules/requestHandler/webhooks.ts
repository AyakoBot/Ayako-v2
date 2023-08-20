import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
import cache from '../cache.js';

export default {
 get: (guild: Discord.Guild, webhookId: string, token?: string) =>
  (cache.apis.get(guild.id) ?? API).webhooks.get(webhookId, { token }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 edit: (
  guild: Discord.Guild,
  webhookId: string,
  body: Discord.RESTPatchAPIWebhookJSONBody,
  data?: { token?: string; reason?: string },
 ) =>
  (cache.apis.get(guild.id) ?? API).webhooks.edit(webhookId, body, data).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 delete: (guild: Discord.Guild, webhookId: string, data?: { token?: string; reason?: string }) =>
  (cache.apis.get(guild.id) ?? API).webhooks.delete(webhookId, data).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 execute: (
  guild: Discord.Guild,
  webhookId: string,
  token: string,
  body: Discord.RESTPostAPIWebhookWithTokenJSONBody &
   Discord.RESTPostAPIWebhookWithTokenQuery & {
    files?: Discord.RawFile[];
    wait: true;
   },
 ) =>
  (cache.apis.get(guild.id) ?? API).webhooks.execute(webhookId, token, body).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 executeSlack: (
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
   }),
 executeGitHub: (
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
   }),
 getMessage: (
  guild: Discord.Guild,
  webhookId: string,
  token: string,
  messageId: string,
  query?: Discord.RESTGetAPIWebhookWithTokenMessageQuery,
 ) =>
  (cache.apis.get(guild.id) ?? API).webhooks
   .getMessage(webhookId, token, messageId, query)
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 editMessage: (
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
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 deleteMessage: (
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
   }),
};
