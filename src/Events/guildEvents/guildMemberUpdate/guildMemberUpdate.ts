import type * as Discord from 'discord.js';
import log from './log.js';
import separator from './separator.js';

export default async (oldMember: Discord.GuildMember, member: Discord.GuildMember) => {
 log(oldMember, member);
 separator(oldMember, member);
};
