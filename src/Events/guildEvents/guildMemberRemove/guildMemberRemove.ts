import type * as Discord from 'discord.js';
import log from './log.js';
import nitro from './nitro.js';

export default async (member: Discord.GuildMember) => {
 log(member);
 nitro(member);
};
