import * as Discord from 'discord.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves a user from the cache or from the API if not found in cache.
 * @param guild - The guild where the user is located.
 * @param userId - The ID of the user to retrieve.
 * @returns A Promise that resolves to the user object.
 */
export default async (guild: Discord.Guild, userId: string) =>
 guild.client.users.cache.get(userId) ??
 (cache.apis.get(guild.id) ?? API).users
  .get(userId)
  .then((u) => {
   const parsed = new Classes.User(guild.client, u);
   if (guild.client.users.cache.get(parsed.id)) return parsed;
   guild.client.users.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => e as Discord.DiscordAPIError);
