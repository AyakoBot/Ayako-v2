import type * as Discord from 'discord.js';
import log from './log.js';
import nitro from './nitro.js';
import customRole from './customRole.js';
import stickyRoles from './stickyRoles.js';

export default async (member: Discord.GuildMember) => {
 log(member);
 nitro(member);
 stickyRoles(member);
 customRole(member);
};
