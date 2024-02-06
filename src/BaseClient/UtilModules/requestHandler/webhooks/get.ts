import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves a webhook from the Discord API and returns a new instance of the `Webhook` class.
 * @param guild The guild where the webhook is located.
 * @param webhookId The ID of the webhook to retrieve.
 * @param token Optional token to use for authentication.
 * @returns A promise that resolves with a new instance of the `Webhook` class,
 * or rejects with a `DiscordAPIError`.
 */
export default async (guild: Discord.Guild, webhookId: string, token?: string) =>
 (guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)).webhooks
  .get(webhookId, { token })
  .then((w) => new Classes.Webhook(guild.client, w))
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
