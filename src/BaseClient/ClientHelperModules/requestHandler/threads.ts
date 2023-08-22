import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';

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
 getMember: (guild: Discord.Guild, threadId: string, userId: string) =>
  (cache.apis.get(guild.id) ?? API).threads.getMember(threadId, userId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getAllMembers: (guild: Discord.Guild, threadId: string) =>
  (cache.apis.get(guild.id) ?? API).threads.getAllMembers(threadId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
};
