import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.leaderboard;
 const user = cmd.options.getUser('user', false) ?? cmd.user;

 const levels = await ch.DataBase.level.findMany({
  where: { guildid: cmd.guildId },
  orderBy: { xp: 'desc' },
  take: 30,
 });

 const self = await ch.DataBase.level.findUnique({
  where: { userid_guildid_type: { userid: user.id, guildid: cmd.guildId, type: 'guild' } },
 });

 const higherXpCount = self
  ? await ch.DataBase.level.count({
     where: { xp: { gt: self.xp }, guildid: cmd.guildId },
    })
  : undefined;

 const position = higherXpCount ?? undefined;
 const users = await Promise.all(levels.map((l) => ch.getUser(l.userid)));

 const { longestLevel, longestXP, longestUsername } = getLongest({ lan, language }, levels, users);
 const ownLevel = self ? await getOwnLevel(self, language, lan) : undefined;

 const embed = await getEmbed(
  { lan, language },
  Number(position),
  { levels, longestLevel, level: Number(self?.level) },
  { xp: Number(self?.xp), longestXP },
  { displayNames: users.map((u) => u?.displayName ?? '-'), longestUsername },
  user,
  cmd.guild,
 );

 embed.fields?.push(...(ownLevel ?? []));

 ch.replyCmd(cmd, { embeds: [embed] });
};

export const getOwnLevel = async (
 self: Prisma.level,
 language: CT.Language,
 lan: CT.Language['slashCommands']['leaderboard'],
): Promise<{ name: string; value: string; inline: boolean }[]> => {
 const settings = await ch.DataBase.leveling.findUnique({
  where: {
   guildid: self.guildid,
  },
 });

 const gain = Number(settings?.xpmultiplier ?? 1);
 const xpPerMsg = Number(settings?.xppermsg ?? 15);

 const newLevel = Number(self.level) + 1;
 const neededXP = (5 / 6) * newLevel * (2 * newLevel * newLevel + 27 * newLevel + 91);
 const duration = ch.moment(
  Math.floor((neededXP - Number(self.xp)) / (xpPerMsg + 10) / gain) * 60000,
  language,
 );

 return [
  {
   name: lan.currentLvl,
   value: ch.splitByThousand(newLevel - 1),
   inline: false,
  },
  {
   name: lan.currentXP,
   value: ch.splitByThousand(Number(self.xp)),
   inline: true,
  },
  {
   name: lan.nextLevelXP,
   value: ch.splitByThousand(neededXP),
   inline: true,
  },
  {
   name: lan.xpDifference,
   value: ch.splitByThousand(neededXP - Number(self.xp)),
   inline: true,
  },
  {
   name: '\u200b',
   value: lan.thisWillTake(
    Math.ceil((neededXP - Number(self.xp)) / gain / (xpPerMsg + 10)),
    duration,
   ),
   inline: false,
  },
 ];
};

export const getLongest = (
 { lan, language }: { lan: CT.Language['slashCommands']['leaderboard']; language: CT.Language },
 levels: Prisma.level[],
 users: (Discord.User | undefined)[],
) => {
 let longestLevel = Math.max(...levels.map((l) => String(l.level).length));
 let longestXP = Math.max(...levels.map((l) => String(ch.splitByThousand(Number(l.xp))).length));
 let longestUsername = Math.max(
  ...users
   .map((u) =>
    u
     ? String(u?.displayName)
        .replace(/[^\w\s'|\-!"§$%&/()=?`´{[\]}^°<>,;.:-_#+*~]/g, '')
        .replace(/\s+/g, ' ')
     : '-',
   )
   .map((u) => u.length),
 );

 if (longestLevel < lan.level.length) longestLevel = lan.level.length;
 if (longestXP < lan.xp.length) longestXP = lan.xp.length;
 if (longestUsername < language.t.User.length) longestUsername = language.t.User.length;

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
 user: Discord.User,
 guild?: Discord.Guild,
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
        { displayName: user.displayName, longestUsername },
       ),
      )}`
    : lan.notRanked,
  },
 ],
 color: ch.getColor(guild ? await ch.getBotMemberFromGuild(guild) : undefined),
 description: `${ch.util.makeInlineCode(
  `${ch.spaces(lan.rank, 7)} | ${ch.spaces(lan.level, longestLevel)} | ${ch.spaces(
   lan.xp,
   longestXP,
  )} | ${ch.spaces(language.t.User, longestUsername)}\n${levels
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
