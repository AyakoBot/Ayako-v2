import type * as Discord from 'discord.js';
import verification from './verification.js';
import log from './log.js';
import ptReminder from './ptReminder.js';
import welcome from './welcome.js';

export default async (member: Discord.GuildMember) => {
 log(member);
 verification(member);
 ptReminder(member);
 welcome(member);
};
