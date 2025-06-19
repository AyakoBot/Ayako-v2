import type * as Discord from 'discord.js';
import customRole from './customRole.js';
import log from './log.js';
import nitro from './nitro.js';
import stickyRoles from './stickyRoles.js';
import ccLeave from './ccLeave.js';
import linkedRolesDeco from './linkedRolesDeco.js';

export default async (member: Discord.GuildMember) => {
 log(member);
 nitro(member);
 stickyRoles(member);
 customRole(member);
 ccLeave(member);
 linkedRolesDeco(member);
};
