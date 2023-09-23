import * as Discord from 'discord.js';
import isManageable from './isManageable.js';

/**
 * Checks if a guild member can moderate another guild member.
 * @param executor - The guild member who is attempting to moderate.
 * @param target - The guild member who is being moderated.
 * @returns Whether the executor can moderate the target.
 */
export default (executor: Discord.GuildMember, target: Discord.GuildMember) =>
 !target.permissions.has(Discord.PermissionFlagsBits.Administrator) &&
 isManageable(target, executor) &&
 executor.permissions.has(Discord.PermissionFlagsBits.ModerateMembers);
