import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import Prisma from '@prisma/client';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type CT from '../../../Typings/CustomTypings.js';
import {
 doAnnouncement,
 getTier,
 endVote,
 currency,
 xp,
 xpmultiplier,
} from '../voteBotEvents/voteBotCreate.js';

export default async (
 vote: CT.TopGGGuildVote,
 guild: Discord.Guild,
 user: Discord.User,
 member: Discord.GuildMember | undefined,
 setting: Prisma.votesettings,
) => {
 const allRewards = await ch.DataBase.voterewards.findMany({
  where: {
   guildid: guild.id,
  },
 });
 const language = await ch.getLanguage(guild.id);

 if (!allRewards?.length) {
  doAnnouncement(setting, user, guild, language);
  return;
 }

 const tier = getTier(allRewards, member);
 const rewards = allRewards.filter((r) => Number(r.tier) === tier);

 rewards.forEach((r) => {
  currency(r, user, guild);
  roles(r, member, guild, language);
  xp(r, user, guild);
  xpmultiplier(r, user, guild);

  ch.DataBase.voters
   .upsert({
    where: { userid_voted: { userid: user.id, voted: vote.guild } },
    update: {
     removetime: Date.now() + 43200000,
     votetype: 'guild',
     tier,
     rewardroles: { push: r.rewardroles },
     rewardxp: { increment: Number(r.rewardxp) },
     rewardcurrency: { increment: Number(r.rewardcurrency) },
     rewardxpmultiplier: { increment: Number(r.rewardxpmultiplier) },
    },
    create: {
     guildid: guild.id,
     userid: user.id,
     removetime: Date.now() + 43200000,
     voted: vote.guild,
     votetype: 'guild',
     tier,
     rewardroles: r.rewardroles,
     rewardxp: r.rewardxp,
     rewardcurrency: r.rewardcurrency,
     rewardxpmultiplier: r.rewardxpmultiplier,
    },
   })
   .then();
 });

 Jobs.scheduleJob(new Date(Date.now() + 43200000), () => endVote(vote, guild));
};

const roles = async (
 r: Prisma.voterewards,
 member: Discord.GuildMember | undefined,
 guild: Discord.Guild,
 language: CT.Language,
) => {
 if (!r.rewardroles?.length) return;
 if (!member) return;

 const me = await ch.getBotMemberFromGuild(member.guild);
 if (!me) {
  ch.error(member.guild, new Error("I can't find myself in this guild!"));
  return;
 }

 ch.roleManager.add(member, r.rewardroles, language.events.vote.guildReason(guild), 1);
};
