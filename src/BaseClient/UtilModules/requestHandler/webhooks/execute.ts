import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';
import * as CT from '../../../../Typings/Typings.js';

/**
 * Executes a webhook with the given parameters
 * and returns a Promise that resolves with a new Message object.
 * @param guild The guild where the webhook is executed.
 * @param webhookId The ID of the webhook to execute.
 * @param token The token of the webhook to execute.
 * @param body The body of the webhook to execute.
 * @returns A Promise that resolves with a new Message object.
 */
function fn(
 guild: undefined | null | Discord.Guild,
 webhookId: string,
 token: string,
 body:
  | (Discord.RESTPostAPIWebhookWithTokenJSONBody &
     Discord.RESTPostAPIWebhookWithTokenQuery & {
      files?: Discord.RawFile[];
     })
  | CT.UsualMessagePayload,
 client: Discord.Client<true>,
): Promise<Classes.Message | Discord.DiscordAPIError>;
function fn(
 guild: Discord.Guild,
 webhookId: string,
 token: string,
 body:
  | (Discord.RESTPostAPIWebhookWithTokenJSONBody &
     Discord.RESTPostAPIWebhookWithTokenQuery & {
      files?: Discord.RawFile[];
     })
  | CT.UsualMessagePayload,
 client?: undefined,
): Promise<Classes.Message | Discord.DiscordAPIError>;
async function fn(
 guild: Discord.Guild | undefined | null,
 webhookId: string,
 token: string,
 body:
  | (Discord.RESTPostAPIWebhookWithTokenJSONBody &
     Discord.RESTPostAPIWebhookWithTokenQuery & {
      files?: Discord.RawFile[];
     })
  | CT.UsualMessagePayload,
 client?: Discord.Client<true>,
) {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');
 const c = (guild?.client ?? client)!;
 const b = body as Discord.RESTPostAPIWebhookWithTokenJSONBody &
  Discord.RESTPostAPIWebhookWithTokenQuery & {
   files?: Discord.RawFile[] | undefined;
  };

 return (guild ? cache.apis.get(guild.id) ?? API : API).webhooks
  .execute(webhookId, token, {
   ...b,
   wait: true,
  })
  .then((m) => new Classes.Message(c, m))
  .catch((e) => {
   if (guild) error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
}

export default fn;
