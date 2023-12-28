import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (oldRole: Discord.Role, role: Discord.Role) => {
 if (oldRole.position !== role.position) return;

 await ch.firstGuildInteraction(role.guild);

 log(oldRole, role);
};
