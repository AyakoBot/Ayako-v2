import * as Discord from 'discord.js';

/**
 * Checks if a guild member can kick another guild member.
 * @param executor - The guild member who is attempting to kick.
 * @param target - The guild member who is being kicked.
 * @returns Whether the executor can kick the target.
 */
export default (executor: Discord.GuildMember, target: Discord.GuildMember) =>
 !target.permissions.has(Discord.PermissionFlagsBits.Administrator) &&
 executor.permissions.has(Discord.PermissionFlagsBits.KickMembers) &&
 executor.roles.highest.comparePositionTo(target.roles.highest) > 0;
