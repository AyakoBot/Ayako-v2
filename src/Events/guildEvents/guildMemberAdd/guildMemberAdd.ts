import * as Discord from 'discord.js';
import verification from './verification.js';
import log from './log.js';
import ptReminder from './ptReminder.js';
import welcome from './welcome.js';
import autoRoles from './autoroles.js';
import checkMuted from './checkMuted.js';
import stickyRoles from './stickyRoles.js';
import stickyPerms from './stickyPerms.js';
import nitro from './nitro.js';

export default async (member: Discord.GuildMember) => {
 log(member);
 ptReminder(member);
 welcome(member);
 stickyPerms(member);
 checkMuted(member);
 nitro(member);

 if (!member.guild.features.includes(Discord.GuildFeature.WelcomeScreenEnabled)) {
  autoRoles(member);
  verification(member);
  stickyRoles(member);
 }
};
