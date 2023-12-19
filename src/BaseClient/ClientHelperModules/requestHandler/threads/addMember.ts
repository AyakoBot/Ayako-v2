import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../Client.js';
import cache from '../../cache.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Adds a member to a thread in a guild.
 * @param guild - The guild where the thread is located.
 * @param threadId - The ID of the thread to add the member to.
 * @param userId - The ID of the user to add to the thread.
 * @returns A promise that resolves with the added member or rejects with a DiscordAPIError.
 */
export default async (thread: Discord.ThreadChannel, userId: string) => {
 if (!canAddMember(await getBotMemberFromGuild(thread.guild), thread)) {
  const e = requestHandlerError(
   `Cannot add member ${userId} to thread ${thread.name} / ${thread.id} in ${thread.guild.name} / ${thread.guild.id}`,
   [Discord.PermissionFlagsBits.SendMessages],
  );

  error(thread.guild, e);
  return e;
 }

 return (cache.apis.get(thread.guild.id) ?? API).threads.addMember(thread.id, userId).catch((e) => {
  error(thread.guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
};
/**
 * Checks if the given guild member has the permission to add members to threads.
 * @param me - The guild member to check.
 * @param thread - The thread channel.
 * @returns A boolean indicating whether the guild member can add members to threads.
 */
export const canAddMember = (me: Discord.GuildMember, thread: Discord.ThreadChannel) =>
 me.permissionsIn(thread.id).has(Discord.PermissionFlagsBits.SendMessages) && !thread.archived;
