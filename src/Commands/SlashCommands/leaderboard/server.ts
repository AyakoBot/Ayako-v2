import Prisma, { FormulaType } from '@prisma/client';
import * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';
import {
 levelToXP,
 xpToLevel,
} from '../../../Events/BotEvents/messageEvents/messageCreate/levelling.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) {
  client.util.guildOnly(cmd);
  return;
 }
 await cmd.deferReply({ ephemeral: true });

 const language = await client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.leaderboard;
 const user = cmd.options.getUser('user', false) ?? cmd.user;

 const levels = await client.util.DataBase.level.findMany({
  where: { guildid: cmd.guildId },
  orderBy: { xp: 'desc' },
  take: 30,
 });

 const self = await client.util.DataBase.level.findUnique({
  where: { userid_guildid_type: { userid: user.id, guildid: cmd.guildId, type: 'guild' } },
 });

 const higherXpCount = self
  ? await client.util.DataBase.level.count({
     where: { xp: { gt: self.xp }, guildid: cmd.guildId },
    })
  : undefined;

 const position = higherXpCount ?? undefined;
 const users = await Promise.all(levels.map((l) => client.util.getUser(l.userid)));

 const { longestLevel, longestXP, longestUsername, settings } = await getLongest(
  { lan, language },
  levels,
  users,
  cmd.guildId,
 );
 const ownLevel = self ? await getOwnLevel(self, language, lan) : undefined;

 const embed = await getEmbed(
  { lan, language },
  Number(position),
  {
   levels,
   longestLevel,
   level: xpToLevel[settings?.formulaType || FormulaType.polynomial](
    self ? Number(self.xp) : 0,
    settings ? Number(settings.curveModifier) : 100,
   ),
  },
  { xp: Number(self?.xp), longestXP },
  { displayNames: users.map((u) => u?.displayName ?? '-'), longestUsername },
  user,
  cmd.guild,
 );

 embed.fields?.push(...(ownLevel ?? []));

 cmd.editReply({
  embeds: [embed],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      url: `https://ayakobot.com/guilds/${cmd.guildId}/leaderboard`,
      label: lan.fullLeaderboard,
      style: Discord.ButtonStyle.Link,
     },
    ],
   },
  ],
 });
};

export const getOwnLevel = async (
 self: Prisma.level,
 language: CT.Language,
 lan: CT.Language['slashCommands']['leaderboard'],
): Promise<{ name: string; value: string; inline: boolean }[]> => {
 const settings = await client.util.DataBase.leveling.findUnique({
  where: { guildid: self.guildid },
 });

 const gain = Number(settings?.xpmultiplier ?? 1);
 const msgXpBottom = Math.abs(Number(settings?.msgXpRangeBottom ?? 15));
 const msgXpTop = Math.abs(Number(settings?.msgXpRangeTop ?? 15));
 const msgXpMedian = (msgXpTop + msgXpBottom) / 2;
 const vcXpBottom = Math.abs(Number(settings?.vcXpRangeBottom ?? 15));
 const vcXpTop = Math.abs(Number(settings?.vcXpRangeTop ?? 15));
 const vcXpMedian = (vcXpTop + vcXpBottom) / 2;

 const newLevel =
  xpToLevel[settings?.formulaType || FormulaType.polynomial](
   Number(self.xp),
   settings ? Number(settings.curveModifier) : 100,
  ) + 1;
 const neededXP = levelToXP[settings?.formulaType || FormulaType.polynomial](
  newLevel,
  settings ? Number(settings.curveModifier) : 100,
 );

 return [
  {
   name: lan.currentLvl,
   value: client.util.splitByThousand(newLevel - 1),
   inline: false,
  },
  {
   name: lan.currentXP,
   value: client.util.splitByThousand(Number(self.xp)),
   inline: true,
  },
  {
   name: lan.nextLevelXP,
   value: client.util.splitByThousand(neededXP),
   inline: true,
  },
  {
   name: lan.xpDifference,
   value: client.util.splitByThousand(neededXP - Number(self.xp)),
   inline: true,
  },
  {
   name: '\u200b',
   value: lan.thisWillTake(
    Math.ceil((neededXP - Number(self.xp)) / gain / msgXpMedian),
    client.util.moment(
     Math.floor((neededXP - Number(self.xp)) / msgXpMedian / gain) * 60000,
     language,
    ),
    Math.ceil((neededXP - Number(self.xp)) / gain / vcXpMedian),
    client.util.moment(
     Math.floor((neededXP - Number(self.xp)) / vcXpMedian / gain) * 60000,
     language,
    ),
   ),
   inline: false,
  },
 ];
};

export const getLongest = async (
 { lan, language }: { lan: CT.Language['slashCommands']['leaderboard']; language: CT.Language },
 levels: Prisma.level[],
 users: (Discord.User | undefined)[],
 guildId: string | null,
) => {
 const settings = guildId
  ? await client.util.DataBase.leveling.findUnique({ where: { guildid: guildId } })
  : null;

 let longestLevel = Math.max(
  ...levels.map(
   (l) =>
    String(
     xpToLevel[settings?.formulaType || FormulaType.polynomial](
      Number(l.xp),
      settings ? Number(settings.curveModifier) : 100,
     ),
    ).length,
  ),
 );
 let longestXP = Math.max(
  ...levels.map((l) => String(client.util.splitByThousand(Number(l.xp))).length),
 );
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

 return { longestLevel, longestXP, longestUsername, settings };
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

 return `${client.util.spaces(
  `${client.util.splitByThousand(pos + 1)}.`,
  7,
 )} | ${client.util.spaces(String(level), longestLevel)} | ${client.util.spaces(
  client.util.splitByThousand(xp),
  longestXP,
 )} | ${client.util.spaces(name.length > 3 ? name : '-', longestUsername)}`;
};

export const getEmbed = async (
 { lan, language }: { lan: CT.Language['slashCommands']['leaderboard']; language: CT.Language },
 position: number,
 { levels, longestLevel, level }: { levels: Prisma.level[]; level: number; longestLevel: number },
 { xp, longestXP }: { xp: number; longestXP: number },
 { displayNames, longestUsername }: { displayNames: string[]; longestUsername: number },
 user: Discord.User,
 guild?: Discord.Guild,
): Promise<Discord.APIEmbed> => {
 const settings = await guild?.client.util.DataBase.leveling.findUnique({
  where: { guildid: guild?.id },
 });

 return {
  author: { name: lan.lleaderboard },
  fields: [
   {
    name: lan.yourPos,
    value:
     typeof position === 'number'
      ? `${client.util.util.makeInlineCode(
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
  color: client.util.getColor(guild ? await client.util.getBotMemberFromGuild(guild) : undefined),
  description: `${client.util.util.makeInlineCode(
   `${client.util.spaces(lan.rank, 7)} | ${client.util.spaces(
    lan.level,
    longestLevel,
   )} | ${client.util.spaces(lan.xp, longestXP)} | ${client.util.spaces(
    language.t.User,
    longestUsername,
   )}\n${levels
    .map((l, i) =>
     makeLine(
      i,
      {
       level: xpToLevel[settings?.formulaType || FormulaType.polynomial](
        Number(l.xp),
        settings ? Number(settings.curveModifier) : 100,
       ),
       longestLevel,
      },
      { xp: Number(l.xp), longestXP },
      { displayName: displayNames[i] || '-', longestUsername },
     ),
    )
    .join('\n')}`,
  )}`,
 };
};
