import type * as Discord from 'discord.js';
import verification from './verification.js';
import log from './log.js';

export default async (member: Discord.GuildMember) => {
 log(member);
 verification(member);

 // TODO
 if (member.guild.id === '298954459172700181' && member.roles.cache.has('1106249504325390336')) {
  member.kick();
 }
};
