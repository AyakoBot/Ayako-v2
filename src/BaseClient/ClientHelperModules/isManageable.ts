import type * as Discord from 'discord.js';

export default (target: Discord.GuildMember, executor: Discord.GuildMember) => {
  if (target.user.id === target.guild.ownerId) return false;
  if (target.user.id === executor.user.id) return false;
  if (executor.user.id === executor.guild.ownerId) return true;
  return executor.roles.highest.comparePositionTo(target.roles.highest) > 0;
};
