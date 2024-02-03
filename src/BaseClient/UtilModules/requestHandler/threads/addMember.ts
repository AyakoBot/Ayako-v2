import * as Discord from 'discord.js';
import { API } from '../../../Bot/Client.js';

/**
 * Adds a member to a thread in a guild.
 * @param thread - The thread to add the member to.
 * @param userId - The ID of the user to add to the thread.
 * @returns A promise that resolves with the added member or rejects with a DiscordAPIError.
 */
export default async (thread: Discord.ThreadChannel, userId: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canAddMember(await thread.client.util.getBotMemberFromGuild(thread.guild), thread)) {
  const e = thread.client.util.requestHandlerError(
   `Cannot add member ${userId} to thread ${thread.name} / ${thread.id} in ${thread.guild.name} / ${thread.guild.id}`,
   [Discord.PermissionFlagsBits.SendMessages],
  );

  thread.client.util.error(thread.guild, e);
  return e;
 }

 return (thread.client.util.cache.apis.get(thread.guild.id) ?? API).threads
  .addMember(thread.id, userId)
  .catch((e) => {
   thread.client.util.error(thread.guild, new Error((e as Discord.DiscordAPIError).message));
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
