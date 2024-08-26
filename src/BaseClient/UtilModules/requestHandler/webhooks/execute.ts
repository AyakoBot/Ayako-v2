import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

type Body =
 | (Omit<
    Discord.RESTPostAPIWebhookWithTokenJSONBody & Discord.RESTPostAPIWebhookWithTokenQuery,
    'files'
   > & { files?: CT.UsualMessagePayload['files'] })
 | CT.UsualMessagePayload;

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
 body: Body,
 client: Discord.Client<true>,
): Promise<Classes.Message | Discord.DiscordAPIError>;
function fn(
 guild: Discord.Guild,
 webhookId: string,
 token: string,
 body: Body,
 client?: undefined,
): Promise<Classes.Message | Discord.DiscordAPIError>;
async function fn(
 guild: Discord.Guild | undefined | null,
 webhookId: string,
 token: string,
 body: Body,
 client?: Discord.Client<true>,
) {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');
 const c = (guild?.client ?? client)!;

 return (await getAPI(guild)).webhooks
  .execute(webhookId, token, {
   ...body,
   files: await resolveFiles(body.files),
   wait: true,
  })
  .then((m) => new Classes.Message(c, m))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
}

export default fn;

export const resolveFiles = async (files: Discord.AttachmentPayload[] | undefined) =>
 files
  ? (await Promise.all(files.map((f) => Discord.resolveFile(f.attachment)))).map((f, i) => ({
     ...f,
     name: files[i].name ?? String(Date.now() + i),
    }))
  : undefined;
