import Prisma from '@prisma/client';
import type * as Discord from 'discord.js';
import { scheduleJob } from 'node-schedule';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';

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
 if (!verification.finishedrole) return;
 if (member.roles.cache.has(verification.finishedrole)) return;
 if (!verification.kicktof) return;
 if (!verification.kickafter) return;
 if (member.user.bot) return;

 ch.logFiles.console.write(
  `Would've tried kicking ${member.user.tag} from ${member.guild.name} (${member.guild.id})\n`,
 );
 return;

 const dm = async () => {
  ch.send(member.user, {
   content: language.verification.kickMsg(member.guild),
  });
 };

 await dm();
 ch.request.guilds.removeMember(member, language.verification.kickReason);
};
