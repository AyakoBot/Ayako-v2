import * as Discord from 'discord.js';
import * as Classes from '../../../Other/classes.js';
import error from '../../error.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Edits the current user's profile in the specified guild.
 * @param guild The guild where the user's profile will be edited.
 * @param data The data to update the user's profile.
 * @param client - The client to use if guild is not defined.
 * @returns A promise that resolves with the updated user's profile.
 */
function fn(
 guild: undefined | null | Discord.Guild,
 data: Discord.RESTPatchAPICurrentUserJSONBody,
 client: Discord.Client<true>,
): Promise<Discord.User | Discord.DiscordAPIError | Error>;
function fn(
 guild: Discord.Guild,
 data: Discord.RESTPatchAPICurrentUserJSONBody,
 client?: undefined,
): Promise<Discord.User | Discord.DiscordAPIError | Error>;
async function fn(
 guild: undefined | null | Discord.Guild,
 data: Discord.RESTPatchAPICurrentUserJSONBody,
 client?: Discord.Client<true>,
): Promise<Discord.User | Discord.DiscordAPIError | Error> {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 const c = (guild?.client ?? client)!;

 return (await getAPI(guild)).users
  .edit({
   ...data,
   avatar: data.avatar ? await Discord.resolveImage(data.avatar) : data.avatar,
  })
  .then((u) => new Classes.User(c, u))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
}

export default fn;
