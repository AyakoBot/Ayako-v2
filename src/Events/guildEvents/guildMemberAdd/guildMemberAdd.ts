import * as Discord from 'discord.js';
import verification from './verification.js';
import log from './log.js';
import ptReminder from './ptReminder.js';
import welcome from './welcome.js';
import autoRoles from './autoroles.js';

export default async (member: Discord.GuildMember) => {
 log(member);
 ptReminder(member);
 welcome(member);

 if (!member.guild.features.includes(Discord.GuildFeature.WelcomeScreenEnabled)) {
  autoRoles(member);
  verification(member);
 }
};
