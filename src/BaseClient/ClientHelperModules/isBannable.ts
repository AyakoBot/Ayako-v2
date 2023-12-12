import * as Discord from 'discord.js';

/**
 * Checks if a guild member can ban another guild member.
 * @param executor - The guild member who is attempting to ban.
 * @param target - The guild member who is being banned.
 * @returns Whether the executor can ban the target.
 */
export default (executor: Discord.GuildMember, target: Discord.GuildMember | undefined | null) =>
 !target?.permissions.has(Discord.PermissionFlagsBits.Administrator) &&
 executor.permissions.has(Discord.PermissionFlagsBits.BanMembers) &&
 (!target || executor.roles.highest.comparePositionTo(target.roles.highest) > 0);
