import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';
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
 const xpPerMsg = Number(settings?.xppermsg ?? 15);
 const xpPerMin = Number(settings?.xppermin ?? 5);

 const newLevel = Number(self.level) + 1;
 const neededXP = (5 / 6) * newLevel * (2 * newLevel * newLevel + 27 * newLevel + 91);

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
    Math.ceil((neededXP - Number(self.xp)) / gain / (xpPerMsg + 10)),
    client.util.moment(
     Math.floor((neededXP - Number(self.xp)) / (xpPerMsg + 10) / gain) * 60000,
     language,
    ),
    Math.ceil((neededXP - Number(self.xp)) / gain / (xpPerMin + 10)),
    client.util.moment(
     Math.floor((neededXP - Number(self.xp)) / (xpPerMin + 10) / gain) * 60000,
     language,
    ),
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
): Promise<Discord.APIEmbed> => ({
 author: {
  name: lan.lleaderboard,
 },
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
     { level: Number(l.level), longestLevel },
     { xp: Number(l.xp), longestXP },
     { displayName: displayNames[i] || '-', longestUsername },
    ),
   )
   .join('\n')}`,
 )}`,
});
