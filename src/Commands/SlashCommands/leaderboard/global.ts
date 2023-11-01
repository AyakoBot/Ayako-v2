import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { getEmbed, getLongest } from './server.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.leaderboard;

 const levels = await ch.DataBase.level.findMany({
  where: { type: 'global' },
  orderBy: { xp: 'desc' },
  take: 30,
 });

 const self = await ch.DataBase.level.findUnique({
  where: { userid_guildid_type: { userid: cmd.user.id, guildid: '1', type: 'global' } },
 });

 const higherXpCount = self
  ? await ch.DataBase.level.count({
     where: { xp: { gt: self.xp }, type: 'global' },
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
  { displayNames: users.map((u) => u?.displayName || '-'), longestUsername },
  cmd,
 );

 ch.replyCmd(cmd, { embeds: [embed] });
};
