import * as Discord from 'discord.js';

/**
 * Determines if a target is manageable by an executor.
 * @param target - The target to check if it's manageable.
 * @param executor - The executor who will manage the target.
 * @returns A boolean indicating if the target is manageable by the executor.
 */
export default (
 target: Discord.GuildMember | Discord.GuildBasedChannel | Discord.Role,
 executor: Discord.GuildMember,
) => {
 if (target instanceof Discord.GuildMember) return member(target, executor);
 if (target instanceof Discord.Role) return role(target, executor);
 return channel(target, executor);
};

/**
 * Checks if a target member can be managed by an executor member.
 * @param target - The member to be managed.
 * @param executor - The member trying to manage the target.
 * @returns Whether the executor can manage the target.
 */
const member = (target: Discord.GuildMember, executor: Discord.GuildMember) => {
 if (
  !executor.permissions.has(Discord.PermissionFlagsBits.ManageRoles, true) ||
  !executor.permissions.has(Discord.PermissionFlagsBits.ModerateMembers, true)
 ) {
  return false;
 }
 if (target.user.id === target.guild.ownerId) return false;
 if (target.user.id === executor.user.id) return false;
 if (executor.user.id === executor.guild.ownerId) return true;
 return executor.roles.highest.comparePositionTo(target.roles.highest) > 0;
};

const channel = (target: Discord.GuildBasedChannel, executor: Discord.GuildMember) =>
 executor.permissionsIn(target).has(Discord.PermissionFlagsBits.ManageChannels);

const role = (target: Discord.Role, executor: Discord.GuildMember) => {
 if (!executor.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) return false;
 if (target.position >= executor.roles.highest.position) return false;
 return true;
};
