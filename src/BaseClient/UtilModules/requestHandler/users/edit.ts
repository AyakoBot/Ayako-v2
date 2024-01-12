import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Edits the current user's profile in the specified guild.
 * @param guild The guild where the user's profile will be edited.
 * @param data The data to update the user's profile.
 * @returns A promise that resolves with the updated user's profile.
 */
export default async (guild: Discord.Guild, data: Discord.RESTPatchAPICurrentUserJSONBody) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return (cache.apis.get(guild.id) ?? API).users
  .edit({
   ...data,
   avatar: data.avatar ? await Discord.DataResolver.resolveImage(data.avatar) : data.avatar,
  })
  .then((u) => new Classes.User(guild.client, u))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
