import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.vote,
 bot: (user: Discord.User, bot: Discord.User, link: string) =>
  t.stp(t.JSON.events.vote.bot, {
   user: user.displayName,
   bot: bot.username,
   link,
  }),
 guild: (user: Discord.User, guild: Discord.Guild, link: string) =>
  t.stp(t.JSON.events.vote.guild, {
   user: user.displayName,
   guild: guild.name,
   link,
  }),
 reward: (reward: string) =>
  t.stp(t.JSON.events.vote.reward, {
   reward,
  }),
 xpmultiplier: t.JSON.events.vote.xpmultiplier,
 botReason: (bot: Discord.User) =>
  t.stp(t.JSON.events.vote.botReason, {
   bot: bot.username,
  }),
 guildReason: (guild: Discord.Guild) =>
  t.stp(t.JSON.events.vote.guildReason, {
   guild: guild.name,
  }),
 endReason: t.JSON.events.vote.endReason,
 reminder: {
  ...t.JSON.events.vote.reminder,
  descBot: (bot: Discord.User) =>
   t.stp(t.JSON.events.vote.reminder.descBot, {
    bot: t.util.constants.standard.user(bot),
   }),
  descGuild: (guild: Discord.Guild) =>
   t.stp(t.JSON.events.vote.reminder.descGuild, {
    guild: guild.name,
   }),
  voteBotButton: (bot: Discord.User) =>
   t.stp(t.JSON.events.vote.reminder.voteBotButton, {
    bot: bot.username,
   }),
  voteGuildButton: (guild: Discord.Guild) =>
   t.stp(t.JSON.events.vote.reminder.voteGuildButton, {
    guild: guild.name,
   }),
 },
});
