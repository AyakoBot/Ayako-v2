import type * as Discord from 'discord.js';
import log from './log.js';
import nitro from './nitro.js';
import customRole from './customRole.js';

export default async (member: Discord.GuildMember) => {
 log(member);
 nitro(member);
 customRole(member);
};
