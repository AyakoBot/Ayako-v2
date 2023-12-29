import Prisma from '@prisma/client';
import type * as Discord from 'discord.js';
import { scheduleJob } from 'node-schedule';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';
import { canRemoveMember } from '../../../BaseClient/ClientHelperModules/requestHandler/guilds/removeMember.js';
import { canAddRoleToMember } from '../../../BaseClient/ClientHelperModules/requestHandler/guilds/addRoleToMember.js';

export default async (member: Discord.GuildMember) => {
 const verification = await ch.DataBase.verification.findUnique({
  where: {
   guildid: member.guild.id,
   active: true,
   pendingrole: { not: null },
  },
 });
 if (!verification) return;

 const language = await ch.getLanguage(member.guild.id);

 preverified(member, verification, language);
 prepKick(member, verification, language);
};

const preverified = async (
 member: Discord.GuildMember,
 verification: Prisma.verification,
 language: CT.Language,
) => {
 if (!verification.pendingrole) return;
 ch.roleManager.add(member, [verification.pendingrole], language.verification.log.started, 1);
};

const prepKick = async (
 member: Discord.GuildMember,
 verification: Prisma.verification,
 language: CT.Language,
) => {
 if (!verification.kicktof) return;
 if (!verification.kickafter) return;
 if (member.user.bot) return;

 scheduleJob(new Date(Date.now() + Number(verification.kickafter) * 1000), async () => {
  kick(member, verification, language);
 });
};

export const kick = async (
 member: Discord.GuildMember,
 verification: Prisma.verification,
 language: CT.Language,
) => {
 const verifyRole = verification.finishedrole
  ? member.guild.roles.cache.get(verification.finishedrole)
  : false;

 if (!verifyRole) return;
 if (member.roles.cache.has(verifyRole.id)) return;
 if (!verification.kicktof) return;
 if (!verification.kickafter) return;
 if (member.user.bot) return;

 const me = await ch.getBotMemberFromGuild(member.guild);
 if (!canRemoveMember(me, member)) return;
 if (!canAddRoleToMember(verifyRole.id, me)) return;

 const dm = async () => {
  ch.send(member.user, {
   content: language.verification.kickMsg(member.guild),
  });
 };

 await dm();
 ch.request.guilds.removeMember(member, language.verification.kickReason);
};
