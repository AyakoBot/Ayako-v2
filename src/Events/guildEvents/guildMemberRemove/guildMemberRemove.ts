import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import customRole from './customRole.js';
import log from './log.js';
import nitro from './nitro.js';
import stickyRoles from './stickyRoles.js';

export default async (member: Discord.GuildMember) => {
 await ch.firstGuildInteraction(member.guild);

 log(member);
 nitro(member);
 stickyRoles(member);
 customRole(member);
};
