import type * as Discord from 'discord.js';
import autoroles from '../guildMemberAdd/autoroles.js';
import stickyRoles from '../guildMemberAdd/stickyRoles.js';
import verification from '../guildMemberAdd/verification.js';
import welcome from '../guildMemberAdd/welcome.js';
import boost from './boost.js';
import cache from './cache.js';
import linkedRolesDeco from './linkedRolesDeco.js';
import log from './log.js';
import nitro from './nitro.js';
import rewards from './rewards.js';
import separator from './separator.js';

export default async (oldMember: Discord.GuildMember, member: Discord.GuildMember) => {
 log(oldMember, member);
 separator(oldMember, member);
 cache(oldMember, member);
 linkedRolesDeco(member);

 if (oldMember.partial) return;

 nitro(oldMember, member);
 boost(oldMember, member);
 rewards(oldMember, member);

 if (oldMember.pending && !member.pending) {
  welcome(member);
  autoroles(member);
  verification(member);
  stickyRoles(member);
 }
};
