import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import * as Classes from '../../../Other/classes.js';

/**
 * Executes a webhook with the given parameters
 * and returns a Promise that resolves with a new Message object.
 * @param guild The guild where the webhook is executed.
 * @param webhookId The ID of the webhook to execute.
 * @param token The token of the webhook to execute.
 * @param body The body of the webhook to execute.
 * @returns A Promise that resolves with a new Message object.
 */
export default async (
 guild: Discord.Guild,
 webhookId: string,
 token: string,
 body: Discord.RESTPostAPIWebhookWithTokenJSONBody &
  Discord.RESTPostAPIWebhookWithTokenQuery & {
   files?: Discord.RawFile[];
  },
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return (
  guild.client.util.cache.apis.get(guild.id) ?? new DiscordCore.API(guild.client.rest)
 ).webhooks
  .execute(webhookId, token, { ...body, wait: true })
  .then((m) => new Classes.Message(guild.client, m))
  .catch((e) => {
   guild.client.util.error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
