import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

/**
 * Joins a thread in a guild.
 * @param guild - The guild where the thread is located.
 * @param threadId - The ID of the thread to join.
 * @returns A promise that resolves with the joined thread or rejects with a DiscordAPIError.
 */
const join = (guild: Discord.Guild, threadId: string) =>
 (cache.apis.get(guild.id) ?? API).threads.join(threadId).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Adds a member to a thread in a guild.
 * @param guild - The guild where the thread is located.
 * @param threadId - The ID of the thread to add the member to.
 * @param userId - The ID of the user to add to the thread.
 * @returns A promise that resolves with the added member or rejects with a DiscordAPIError.
 */
const addMember = (guild: Discord.Guild, threadId: string, userId: string) =>
 (cache.apis.get(guild.id) ?? API).threads.addMember(threadId, userId).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Leaves a thread in a guild.
 * @param guild - The guild where the thread is located.
 * @param threadId - The ID of the thread to leave.
 * @returns A promise that resolves with the DiscordAPIError if an error occurs, otherwise void.
 */
const leave = (guild: Discord.Guild, threadId: string) =>
 (cache.apis.get(guild.id) ?? API).threads.leave(threadId).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Removes a member from a thread in a guild.
 * @param guild - The guild where the thread is located.
 * @param threadId - The ID of the thread to remove the member from.
 * @param userId - The ID of the user to remove from the thread.
 * @returns A promise that resolves with the removed member's ID if successful,
 * or rejects with a DiscordAPIError if unsuccessful.
 */
const removeMember = (guild: Discord.Guild, threadId: string, userId: string) =>
 (cache.apis.get(guild.id) ?? API).threads.removeMember(threadId, userId).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });

/**
 * Get the member object for a given thread and user ID.
 * @param thread - The thread channel object.
 * @param userId - The ID of the user to get the member object for.
 * @returns A promise that resolves to the thread member object for the given user ID.
 */
const getMember = async (thread: Discord.ThreadChannel, userId: string) =>
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

/**
 * Retrieves all members of a given thread channel.
 * @param thread - The thread channel to retrieve members from.
 * @returns A promise that resolves with an array of ThreadMember objects
 * representing the members of the thread.
 */
const getAllMembers = (thread: Discord.ThreadChannel) =>
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
   error(thread.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Object containing methods for handling threads.
 * @property {Function} join
 * - Method for joining a thread.
 * @property {Function} addMember
 * - Method for adding a member to a thread.
 * @property {Function} leave
 * - Method for leaving a thread.
 * @property {Function} removeMember
 * - Method for removing a member from a thread.
 * @property {Function} getMember
 * - Method for getting a member from a thread.
 * @property {Function} getAllMembers
 * - Method for getting all members from a thread.
 */
export default {
 join,
 addMember,
 leave,
 removeMember,
 getMember,
 getAllMembers,
};
