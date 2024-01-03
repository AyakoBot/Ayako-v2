import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.leaderboard;
 const user = cmd.options.getUser('user', false) ?? cmd.user;

 const nitroUsers = await ch.DataBase.nitrousers.findMany({
  where: { guildid: cmd.guildId },
 });

 const daysPerUser = getDaysPerUsers(nitroUsers).sort((a, b) => b.days - a.days);
 const self = daysPerUser.find((d) => d.userId === user.id);
 const position = self ? daysPerUser.findIndex((s) => s.userId === user.id) + 1 : 0;
 const users = await Promise.all(daysPerUser.map((d) => ch.getUser(d.userId)));

 const { longestDays, longestUsername } = getLongest({ lan, language }, daysPerUser, users);

 const embed = await getEmbed(
  { lan, language },
  position,
  { days: Number(self?.days), longestDays, daysPerUser },
  { displayNames: users.map((u) => u?.displayName ?? '-'), longestUsername },
  user,
  cmd.guild,
 );

 ch.replyCmd(cmd, { embeds: [embed] });
};

const getDaysPerUsers = (nitroUsers: Prisma.nitrousers[]) => {
 const daysPerUser: { userId: string; days: number }[] = [];
 nitroUsers.forEach((u) => {
  const days = getDaysBetween2Days(Number(u.booststart), Number(u.boostend) || Date.now());
  const user = daysPerUser.find((d) => d.userId === u.userid);

  if (user) user.days += days;
  else daysPerUser.push({ days, userId: u.userid });
 });
 return daysPerUser;
};

const getDaysBetween2Days = (date1: number, date2: number) => {
 const diffTime = Math.abs(date2 - date1);
 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
 return diffDays;
};

const getLongest = (
 { lan, language }: { lan: CT.Language['slashCommands']['leaderboard']; language: CT.Language },
 daysPerUser: { days: number; userId: string }[],
 users: (Discord.User | undefined)[],
) => {
 let longestDays = Math.max(...daysPerUser.map((l) => String(l.days).length));
 let longestUsername = Math.max(
  ...users
   .map((u) =>
    u
     ? String(u?.displayName)
        .replace(/[^\w\s'|\-!"§$%&/()=?`´{[\]}^°<>,;.:-_#+*~]/g, '')
        .replace(/\s+/g, ' ')
     : '-',
   )
   .map((u) => u.length + 1),
 );

 if (longestDays < lan.days.length) longestDays = lan.level.length;
 if (longestUsername < language.t.User.length) longestUsername = language.t.User.length;

 return { longestUsername, longestDays };
};

export const makeLine = (
 pos: number,
 { days, longestDays }: { days: number; longestDays: number },
 { displayName, longestUsername }: { displayName: string; longestUsername: number },
) => {
 const name = displayName
  .replace(/[^\w\s'|\-!"§$%&/()=?`´{[\]}^°<>,;.:-_#+*~]/g, '')
  .replace(/\s+/g, ' ');

 return `${ch.spaces(`${ch.splitByThousand(pos + 1)}.`, 7)} | ${ch.spaces(
  String(days),
  longestDays,
 )} | ${ch.spaces(name.length > 3 ? name : '-', longestUsername)}`;
};

const getEmbed = async (
 { lan, language }: { lan: CT.Language['slashCommands']['leaderboard']; language: CT.Language },
 position: number,
 {
  days,
  longestDays,
  daysPerUser,
 }: { days: number; longestDays: number; daysPerUser: { days: number; userId: string }[] },
 { displayNames, longestUsername }: { displayNames: string[]; longestUsername: number },
 user: Discord.User,
 guild: Discord.Guild,
): Promise<Discord.APIEmbed> => ({
 author: {
  name: lan.nleaderboard,
 },
 fields: [
  {
   name: lan.yourPos,
   value: position
    ? `${ch.util.makeInlineCode(
       makeLine(
        position - 1,
        { days, longestDays },
        { displayName: user.displayName, longestUsername },
       ),
      )}`
    : lan.notRanked,
  },
 ],
 color: ch.getColor(await ch.getBotMemberFromGuild(guild)),
 description: `${ch.util.makeInlineCode(
  `${ch.spaces(lan.rank, 6)} | ${ch.spaces(lan.days, longestDays)} |  ${ch.spaces(
   language.t.User,
   longestUsername,
  )}\n${daysPerUser
   .map((l, i) =>
    makeLine(
     i,
     { days: l.days, longestDays },
     { displayName: displayNames[i] || '-', longestUsername },
    ),
   )
   .join('\n')}`,
 )}`,
});
