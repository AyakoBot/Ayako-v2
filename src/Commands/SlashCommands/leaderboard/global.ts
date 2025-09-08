import * as Discord from 'discord.js';
import { getEmbed, getLongest, getOwnLevel } from './server.js';
import { FormulaType } from '@prisma/client';
import { xpToLevel } from '../../../Events/BotEvents/messageEvents/messageCreate/levelling.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 await cmd.deferReply({ ephemeral: true });

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.leaderboard;
 const user = cmd.options.getUser('user', false) ?? cmd.user;

 const levels = await cmd.client.util.DataBase.level.findMany({
  where: { type: 'global' },
  orderBy: { xp: 'desc' },
  take: 30,
 });

 const self = await cmd.client.util.DataBase.level.findUnique({
  where: { userid_guildid_type: { userid: user.id, guildid: '1', type: 'global' } },
 });

 const higherXpCount = self
  ? await cmd.client.util.DataBase.level.count({
     where: { xp: { gt: self.xp }, type: 'global' },
    })
  : undefined;

 const position = higherXpCount ?? undefined;
 const users = await Promise.all(levels.map((l) => cmd.client.util.getUser(l.userid)));
 const ownLevel = self ? await getOwnLevel(self, language, lan) : undefined;

 const { longestLevel, longestXP, longestUsername, settings } = await getLongest(
  { lan, language },
  levels,
  users,
  cmd.guildId,
 );

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
  { displayNames: users.map((u) => u?.displayName || '-'), longestUsername },
  user,
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
      url: `https://ayakobot.com/guilds/1/leaderboard`,
      label: lan.fullLeaderboard,
      style: Discord.ButtonStyle.Link,
     },
    ],
   },
  ],
 });
};
