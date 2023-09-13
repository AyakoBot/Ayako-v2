import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

const cacheSetter = (
 cacheItem: unknown,
 // eslint-disable-next-line @typescript-eslint/ban-types
 cacheSet: Function | undefined,
 item: unknown,
 key?: string,
) => {
 if (!cacheSet) return;
 if (!cacheItem) cacheSet(key ?? (item as { [key: string]: string }).id, item);
};

export default {
 join: (guild: Discord.Guild, threadId: string) =>
  (cache.apis.get(guild.id) ?? API).threads.join(threadId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 addMember: (guild: Discord.Guild, threadId: string, userId: string) =>
  (cache.apis.get(guild.id) ?? API).threads.addMember(threadId, userId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 leave: (guild: Discord.Guild, threadId: string) =>
  (cache.apis.get(guild.id) ?? API).threads.leave(threadId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 removeMember: (guild: Discord.Guild, threadId: string, userId: string) =>
  (cache.apis.get(guild.id) ?? API).threads.removeMember(threadId, userId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getMember: (thread: Discord.ThreadChannel, userId: string) =>
  (cache.apis.get(thread.guild.id) ?? API).threads
   .getMember(thread.id, userId)
   .then((m) => {
    const parsed = new Classes.ThreadMember(thread, m);
    cacheSetter(thread.members.cache.get(parsed.id), thread.members.cache.set, parsed);
    return parsed;
   })
   .catch((e) => {
    error(thread.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getAllMembers: (thread: Discord.ThreadChannel) =>
  (cache.apis.get(thread.guild.id) ?? API).threads
   .getAllMembers(thread.id)
   .then((members) => {
    const parsed = members.map((m) => new Classes.ThreadMember(thread, m));
    parsed.forEach((p) => cacheSetter(thread.members.cache.get(p.id), thread.members.cache.set, p));
    return parsed;
   })
   .catch((e) => {
    error(thread.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
};
