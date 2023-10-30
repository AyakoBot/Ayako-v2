import * as Discord from 'discord.js';
// eslint-disable-next-line import/no-cycle
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Get the member object for a given thread and user ID.
 * @param thread - The thread channel object.
 * @param userId - The ID of the user to get the member object for.
 * @returns A promise that resolves to the thread member object for the given user ID.
 */
export default (thread: Discord.ThreadChannel, userId: string) =>
 thread.members.cache.get(userId) ??
 (cache.apis.get(thread.guild.id) ?? API).threads
  .getMember(thread.id, userId)
  .then((m) => {
   const parsed = new Classes.ThreadMember(thread, m);
   if (thread.members.cache.get(parsed.id)) return parsed;
   thread.members.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(thread.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
