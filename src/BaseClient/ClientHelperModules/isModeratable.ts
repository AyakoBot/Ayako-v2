import * as Discord from 'discord.js';
import isManageable from './isManageable';

export default (executor: Discord.GuildMember, target: Discord.GuildMember) =>
 !target.permissions.has(Discord.PermissionFlagsBits.Administrator) &&
 isManageable(target, executor) &&
 executor.permissions.has(Discord.PermissionFlagsBits.ModerateMembers);
