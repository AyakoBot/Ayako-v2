import type * as Discord from 'discord.js';
import log from './log.js';
import customRole from './customRole.js';

export default async (role: Discord.Role) => {
 log(role);
 customRole(role);
};
