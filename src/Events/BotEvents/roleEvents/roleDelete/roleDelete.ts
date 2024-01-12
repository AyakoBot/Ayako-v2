import type * as Discord from 'discord.js';
import customRole from './customRole.js';
import log from './log.js';

export default async (role: Discord.Role) => {
 log(role);
 customRole(role);
};
