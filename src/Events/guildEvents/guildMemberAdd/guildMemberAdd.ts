import * as Discord from 'discord.js';
import antiraid from './antiraid.js';
import autoRoles from './autoroles.js';
import checkMuted from './checkMuted.js';
import dmAd from './dmAd.js';
import log from './log.js';
import nitro from './nitro.js';
import ptReminder from './ptReminder.js';
import stickyPerms from './stickyPerms.js';
import stickyRoles from './stickyRoles.js';
import verification from './verification.js';
import welcome from './welcome.js';

export default async (member: Discord.GuildMember) => {
 if (!member.guild) return;

 log(member);
 ptReminder(member);
 welcome(member);
 stickyPerms(member);
 checkMuted(member);
 nitro(member);
 antiraid(member);
 dmAd(member);

 if (!member.guild.features.includes(Discord.GuildFeature.WelcomeScreenEnabled)) {
  autoRoles(member);
  verification(member);
  stickyRoles(member);
 }
};
