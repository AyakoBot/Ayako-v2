import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

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
    thread.members.cache.set(parsed.id, parsed);
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
    parsed.forEach((p) => thread.members.cache.set(p.id, p));
    return parsed;
   })
   .catch((e) => {
    error(thread.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
};
