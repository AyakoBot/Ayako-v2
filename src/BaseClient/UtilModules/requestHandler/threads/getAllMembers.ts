import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Bot/Client.js';
import cache from '../../cache.js';
import * as Classes from '../../../Other/classes.js';

/**
 * Retrieves all members of a given thread channel.
 * @param thread - The thread channel to retrieve members from.
 * @returns A promise that resolves with an array of ThreadMember objects
 * representing the members of the thread.
 */
export default async (thread: Discord.ThreadChannel) =>
 (cache.apis.get(thread.guild.id) ?? API).threads
  .getAllMembers(thread.id)
  .then((members) => {
   const parsed = members.map((m) => new Classes.ThreadMember(thread, m));
   parsed.forEach((p) => {
    if (thread.members.cache.get(p.id)) return;
    thread.members.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(thread.guild, e);
   return e as Discord.DiscordAPIError;
  });
