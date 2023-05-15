import type * as Discord from 'discord.js';
import log from './log.js';
import separator from './separator.js';
import userBotDetector from './userBotDetector.js';

export default async (oldMember: Discord.GuildMember, member: Discord.GuildMember) => {
 log(oldMember, member);
 separator(oldMember, member);
 userBotDetector(oldMember, member);
};
