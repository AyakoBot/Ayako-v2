import * as Discord from 'discord.js';
import Prisma from '@prisma/client';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.leaderboard;

 const levels = await ch.DataBase.level.findMany({
  where: { guildid: cmd.guildId },
  orderBy: { xp: 'desc' },
  take: 30,
 });

 const self = await ch.DataBase.level.findUnique({
  where: { userid_guildid_type: { userid: cmd.user.id, guildid: cmd.guildId, type: 'guild' } },
 });

 const higherXpCount = self
  ? await ch.DataBase.level.count({
     where: { xp: { gt: self.xp }, guildid: cmd.guildId },
    })
  : undefined;

 const position = higherXpCount ?? undefined;
 const users = await Promise.all(levels.map((l) => ch.getUser(l.userid)));

 const { longestLevel, longestXP, longestUsername } = getLongest({ lan, language }, levels, users);

 const embed = await getEmbed(
  { lan, language },
  Number(position),
  { levels, longestLevel, level: Number(self?.level) },
  { xp: Number(self?.xp), longestXP },
  { displayNames: users.map((u) => u?.displayName ?? '-'), longestUsername },
  cmd,
 );

 ch.replyCmd(cmd, { embeds: [embed] });
};

export const getLongest = (
 { lan, language }: { lan: CT.Language['slashCommands']['leaderboard']; language: CT.Language },
 levels: Prisma.level[],
 users: (Discord.User | undefined)[],
) => {
 let longestLevel = levels
  .map((l) => String(l.level))
  .reduce((a, b) => (a.length > b.length ? a : b)).length;
 let longestXP = levels
  .map((l) => String(ch.splitByThousand(Number(l.xp))))
  .reduce((a, b) => (a.length > b.length ? a : b)).length;
 let longestUsername =
  users
   .map((u) =>
    u
     ? String(u?.displayName)
        .replace(/[^\w\s'|\-!"§$%&/()=?`´{[\]}^°<>,;.:-_#+*~]/g, '')
        .replace(/\s+/g, ' ')
     : '-',
   )
   .reduce((a, b) => (a.length > b.length ? a : b)).length + 1;

 if (longestLevel < lan.level.length) longestLevel = lan.level.length;
 if (longestXP < lan.xp.length) longestXP = lan.xp.length;
 if (longestUsername < language.User.length) longestUsername = language.User.length;

 return { longestLevel, longestXP, longestUsername };
};

export const makeLine = (
 pos: number,
 { level, longestLevel }: { level: number; longestLevel: number },
 { xp, longestXP }: { xp: number; longestXP: number },
 { displayName, longestUsername }: { displayName: string; longestUsername: number },
) => {
 const name = displayName
  .replace(/[^\w\s'|\-!"§$%&/()=?`´{[\]}^°<>,;.:-_#+*~]/g, '')
  .replace(/\s+/g, ' ');

 return `${ch.spaces(`${ch.splitByThousand(pos + 1)}.`, 7)} | ${ch.spaces(
  String(level),
  longestLevel,
 )} | ${ch.spaces(ch.splitByThousand(xp), longestXP)} | ${ch.spaces(
  name.length > 3 ? name : '-',
  longestUsername,
 )}`;
};

export const getEmbed = async (
 { lan, language }: { lan: CT.Language['slashCommands']['leaderboard']; language: CT.Language },
 position: number,
 { levels, longestLevel, level }: { levels: Prisma.level[]; level: number; longestLevel: number },
 { xp, longestXP }: { xp: number; longestXP: number },
 { displayNames, longestUsername }: { displayNames: string[]; longestUsername: number },
 cmd: Discord.ChatInputCommandInteraction,
): Promise<Discord.APIEmbed> => ({
 author: {
  name: lan.lleaderboard,
 },
 fields: [
  {
   name: lan.yourPos,
   value: position
    ? `${ch.util.makeInlineCode(
       makeLine(
        position,
        { level: Number(level), longestLevel },
        { xp: Number(xp) ?? 0, longestXP },
        { displayName: cmd.user.displayName, longestUsername },
       ),
      )}`
    : lan.notRanked,
  },
 ],
 color: ch.getColor(cmd.guild ? await ch.getBotMemberFromGuild(cmd.guild) : undefined),
 description: `${ch.util.makeInlineCode(
  `${ch.spaces(lan.rank, 7)} | ${ch.spaces(lan.level, longestLevel)} | ${ch.spaces(
   lan.xp,
   longestXP,
  )} | ${ch.spaces(language.User, longestUsername)}\n${levels
   .map((l, i) =>
    makeLine(
     i,
     { level: Number(l.level), longestLevel },
     { xp: Number(l.xp), longestXP },
     { displayName: displayNames[i] || '-', longestUsername },
    ),
   )
   .join('\n')}`,
 )}`,
});
