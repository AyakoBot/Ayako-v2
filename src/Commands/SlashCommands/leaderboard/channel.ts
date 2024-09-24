import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';
import { getLevel } from '../../ButtonCommands/set-level/user/calc.js';
import { GuildTextChannelTypes } from '../../../Typings/Channel.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) {
  client.util.guildOnly(cmd);
  return;
 }
 await cmd.deferReply({ ephemeral: true });

 const language = await client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.leaderboard;
 const channel = cmd.options.getChannel('channel', false, GuildTextChannelTypes) ?? cmd.channel!;
 const user = cmd.options.getUser('user', false) ?? cmd.user;

 const levels = await client.util.DataBase.levelchannels.findMany({
  where: { guildid: cmd.guildId, channelid: channel.id },
  orderBy: { xp: 'desc' },
  take: 30,
 });

 const self = await client.util.DataBase.levelchannels.findUnique({
  where: {
   userid_guildid_channelid: { userid: user.id, guildid: cmd.guildId, channelid: channel.id },
  },
 });

 const higherXpCount = self
  ? await client.util.DataBase.levelchannels.count({
     where: { xp: { gt: self.xp }, guildid: cmd.guildId },
    })
  : undefined;

 const position = higherXpCount ?? undefined;
 const users = await Promise.all(levels.map((l) => client.util.getUser(l.userid)));

 const { longestLevel, longestXP, longestUsername } = getLongest({ lan, language }, levels, users);
 const ownLevel = self
  ? [
     {
      name: lan.currentXP,
      value: client.util.splitByThousand(Number(self.xp)),
      inline: true,
     },
    ]
  : undefined;

 const embed = await getEmbed(
  { lan, language },
  Number(position),
  { levels, longestLevel, level: getLevel(Number(self?.xp)) },
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

export const getLongest = (
 { lan, language }: { lan: CT.Language['slashCommands']['leaderboard']; language: CT.Language },
 levels: Prisma.levelchannels[],
 users: (Discord.User | undefined)[],
) => {
 let longestLevel = Math.max(...levels.map((l) => String(getLevel(Number(l.xp))).length));
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
 {
  levels,
  longestLevel,
  level,
 }: { levels: Prisma.levelchannels[]; level: number; longestLevel: number },
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
     { level: getLevel(Number(l.xp)), longestLevel },
     { xp: Number(l.xp), longestXP },
     { displayName: displayNames[i] || '-', longestUsername },
    ),
   )
   .join('\n')}`,
 )}`,
});
