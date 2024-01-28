import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import Prisma from '@prisma/client';
import * as CT from '../../../Typings/Typings.js';
import { doAnnouncement, end, currency, xp, xpmultiplier } from './voteBotCreate.js';

export default async (
 vote: CT.TopGGGuildVote,
 guild: Discord.Guild,
 user: Discord.User,
 member: Discord.GuildMember | undefined,
 setting: Prisma.votesettings,
) => {
 const allRewards = await guild.client.util.DataBase.voterewards.findMany({
  where: { guildid: guild.id, linkedid: setting.uniquetimestamp },
 });
 const language = await guild.client.util.getLanguage(guild.id);

 const reminder = await guild.client.util.DataBase.votes.create({
  data: {
   guildid: guild.id,
   userid: user.id,
   votetype: 'guild',
   voted: vote.guild,
   endtime: Date.now() + 42_900_000, // 11:55 hours
   relatedsetting: setting.uniquetimestamp,
  },
 });
 if (!reminder) return;

 if (!allRewards?.length) {
  doAnnouncement(setting, user, guild, language, []);
  return;
 }

 const isWeekend = [5, 6, 0].includes(new Date().getDay());
 const rewards = allRewards.filter(
  (r) =>
   r.weekends === 'everyDay' ||
   (isWeekend ? r.weekends === 'onlyOnWeekend' : r.weekends === 'onlyOnWeekdays'),
 );

 const existingCache = guild.client.util.cache.votes.cache
  .get(guild.id)
  ?.get(vote.guild)
  ?.get(user.id);
 if (existingCache) {
  existingCache.invoke();
  await guild.client.util.sleep(10000);
 }

 rewards.forEach((r) => {
  currency(r, user, guild);
  roles(r, member, guild, language);
  xp(r, user, guild);
  xpmultiplier(r, user, guild);

  guild.client.util.DataBase.votesappliedrewards
   .upsert({
    where: { userid_voted: { userid: user.id, voted: vote.guild } },
    update: {
     rewardroles: { push: r.rewardroles },
     rewardxp: { increment: Number(r.rewardxp) },
     rewardcurrency: { increment: Number(r.rewardcurrency) },
     rewardxpmultiplier: { increment: Number(r.rewardxpmultiplier) },
    },
    create: {
     voted: vote.guild,
     userid: user.id,
     rewardroles: r.rewardroles,
     rewardxp: r.rewardxp,
     rewardcurrency: r.rewardcurrency,
     rewardxpmultiplier: r.rewardxpmultiplier,
     relatedvote: reminder.endtime,
    },
   })
   .then();
 });

 guild.client.util.cache.votes.set(
  Jobs.scheduleJob(new Date(Date.now() + 42_900_000), () => end(reminder, guild)),
  guild.id,
  vote.guild,
  user.id,
 );
 doAnnouncement(setting, user, guild, language, rewards);
};

const roles = async (
 r: Prisma.voterewards,
 member: Discord.GuildMember | undefined,
 guild: Discord.Guild,
 language: CT.Language,
) => {
 if (!r.rewardroles?.length) return;
 if (!member) return;

 guild.client.util.roleManager.add(
  member,
  r.rewardroles,
  language.events.vote.guildReason(guild),
  1,
 );
};
