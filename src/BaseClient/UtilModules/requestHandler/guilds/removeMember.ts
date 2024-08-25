import * as Discord from 'discord.js';
import error from '../../error.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import requestHandlerError from '../../requestHandlerError.js';
import { getAPI } from '../channels/addReaction.js';

/**
 * Removes a member from a guild.
 * @param member The member to remove.
 * @param reason The reason for removing the member (optional).
 * @returns A promise that resolves with the removed member's data if successful,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (member: Discord.GuildMember, reason?: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canRemoveMember(await getBotMemberFromGuild(member.guild), member)) {
  const e = requestHandlerError(
   `Cannot remove member ${member.displayName} / ${member.id} from ${member.guild.name} / ${member.guild.id}`,
   [Discord.PermissionFlagsBits.KickMembers],
  );

  error(member.guild, e);
  return e;
 }

 return (await getAPI(member.guild)).guilds
  .removeMember(member.guild.id, member.id, { reason })
  .catch((e) => {
   error(member.guild, e);
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the permission to remove members.
 * @param me - The guild member to check.
 * @param member - The guild member to remove.
 * @returns True if the guild member has the permission to remove members, false otherwise.
 */
export const canRemoveMember = (me: Discord.GuildMember, member: Discord.GuildMember) =>
 me.permissions.has(Discord.PermissionFlagsBits.KickMembers) &&
 me.roles.highest.comparePositionTo(member.roles.highest) > 0 &&
 member.guild.ownerId !== member.id;
