import type * as Discord from 'discord.js';
import log from './log.js';

export default async (oldRole: Discord.Role, role: Discord.Role) => {
 if (oldRole.position !== role.position) return;

 log(oldRole, role);
};
