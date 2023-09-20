import * as Discord from 'discord.js';

export default (
 target: Discord.GuildMember | Discord.GuildBasedChannel | Discord.Role,
 executor: Discord.GuildMember,
) => {
 if (target instanceof Discord.GuildMember) return member(target, executor);
 if (target instanceof Discord.Role) return role(target, executor);
 return channel(target, executor);
};

const member = (target: Discord.GuildMember, executor: Discord.GuildMember) => {
 if (
  !target.permissions.has(Discord.PermissionFlagsBits.ManageRoles, true) ||
  !target.permissions.has(Discord.PermissionFlagsBits.ModerateMembers, true)
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
