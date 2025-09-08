import Prisma, { type votes } from '@prisma/client';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import getPathFromError from '../../../BaseClient/UtilModules/getPathFromError.js';
import * as CT from '../../../Typings/Typings.js';

export default async (
 vote: CT.TopGGVote,
 guild: Discord.Guild,
 user: Discord.User,
 member: Discord.GuildMember | undefined,
 setting: Prisma.votesettings,
) => {
 const allRewards = await guild.client.util.DataBase.voterewards.findMany({
  where: { guildid: guild.id, linkedid: setting.uniquetimestamp },
 });

 const bot = await guild.client.util.getUser(vote.bot).catch(() => undefined);
 if (!bot) return;

 const language = await guild.client.util.getLanguage(guild.id);

 const reminder = await guild.client.util.DataBase.votes.upsert({
  where: { guildid_userid_voted: { guildid: guild.id, userid: user.id, voted: vote.bot } },
  create: {
   guildid: guild.id,
   userid: user.id,
   votetype: 'bot',
   voted: vote.bot,
   endtime: Date.now() + 43190000, // 11:59:50
   relatedsetting: setting.uniquetimestamp,
  },
  update: {
   endtime: Date.now() + 43190000, // 11:59:50
   relatedsetting: setting.uniquetimestamp,
  },
 });
 if (!reminder) return;

 if (!allRewards?.length) {
  doAnnouncement(setting, user, bot, language, []);
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
  ?.get(vote.bot)
  ?.get(user.id);
 if (existingCache) {
  existingCache.invoke();
  await guild.client.util.sleep(10000);
 }

 rewards.forEach((r) => {
  const rewardRoles = r.rewardroles?.filter((roleId) => !member?.roles.cache.has(roleId));

  currency(r, user, guild);
  roles(rewardRoles, member, bot, language);
  xp(r, user, guild);
  xpmultiplier(r, user, guild);

  guild.client.util.DataBase.votesappliedrewards
   .upsert({
    where: { userid_voted: { userid: user.id, voted: vote.bot } },
    update: {
     rewardroles: { push: rewardRoles },
     rewardxp: { increment: Number(r.rewardxp) },
     rewardcurrency: { increment: Number(r.rewardcurrency) },
     rewardxpmultiplier: { increment: Number(r.rewardxpmultiplier) },
    },
    create: {
     voted: vote.bot,
     userid: user.id,
     rewardroles: rewardRoles,
     rewardxp: r.rewardxp,
     rewardcurrency: r.rewardcurrency,
     rewardxpmultiplier: r.rewardxpmultiplier,
     relatedvote: reminder.endtime,
    },
   })
   .then();
 });

 guild.client.util.cache.votes.set(
  Jobs.scheduleJob(getPathFromError(new Error(vote.bot)), new Date(Date.now() + 42_900_000), () =>
   end(reminder, guild),
  ),
  guild.id,
  vote.bot,
  user.id,
 );

 doAnnouncement(setting, user, bot, language, rewards);
};

export const doAnnouncement = async (
 settings: Prisma.votesettings,
 user: Discord.User,
 voted: Discord.User | Discord.Guild,
 language: CT.Language,
 rewards: Prisma.voterewards[],
) => {
 if (!settings.announcementchannel) return;

 const channel = await user.client.util.getChannel.guildTextChannel(settings.announcementchannel);
 if (!channel) return;

 const currencyRewards = rewards
  ?.filter((r) => !!r.rewardcurrency)
  ?.map((r) => Number(r.rewardcurrency))
  .reduce((b, a) => b + a, 0);
 const lan = language.events.vote;

 const rewardText = rewards
  .map((r, i) =>
   [
    r.rewardroles
     ? lan.tempReward(r.rewardroles.map((roleId) => `<@&${roleId}>`).join(', '))
     : null,
    r.rewardxpmultiplier ? lan.tempReward(`${r.rewardxpmultiplier}x ${lan.xpmultiplier}`) : null,
    r.rewardxp ? `${r.rewardxp} XP` : null,
    currencyRewards && i === 0
     ? `${currencyRewards} ${user.client.util.constants.standard.getEmote(
        user.client.util.emotes.book,
       )}`
     : null,
   ]
    .filter((u): u is string => !!u)
    .join(' + '),
  )
  .map((t) => `> ${t}`)
  .join('\n');

 user.client.util.send(channel, {
  content: `${
   'username' in voted
    ? lan.bot(user, voted, `https://top.gg/bot/${voted.id}/vote`)
    : lan.guild(user, voted, `https://top.gg/servers/${voted.id}/vote`)
  }${rewardText.length ? `\n${lan.rewards}\n${rewardText}` : ''}`,
 });
};

export const end = async (vote: votes, guild: Discord.Guild) => {
 guild.client.util.cache.votes.delete(guild.id, vote.voted, vote.userid);

 const appliedRewards = await guild.client.util.DataBase.votesappliedrewards.findMany({
  where: { voted: vote.voted, userid: vote.userid },
 });
 if (!vote) return;

 await guild.client.util.DataBase.votes.delete({ where: { endtime: vote.endtime } });
 await guild.client.util.DataBase.votesappliedrewards.deleteMany({
  where: { voted: vote.voted, userid: vote.userid },
 });

 const member = await guild.client.util.request.guilds
  .getMember(guild, vote.userid)
  .then((m) => ('message' in m ? undefined : m));
 if (!member) return;

 const language = await guild.client.util.getLanguage(guild.id);
 const lan = language.events.vote;

 guild.client.util.roleManager.remove(
  member,
  appliedRewards
   .filter((r) => r.rewardroles?.length)
   .map((r) => r.rewardroles)
   .filter((r): r is string[] => !!r)
   .flat(),
  language.events.vote.endReason,
  1,
 );

 const settings = await guild.client.util.DataBase.votesettings.findUnique({
  where: { uniquetimestamp: vote.relatedsetting },
 });
 if (!settings?.reminders) return;

 const user = await guild.client.util.DataBase.users.findUnique({
  where: { userid: vote.userid },
 });
 if (user && !user.votereminders) return;

 const voted =
  vote.votetype === 'bot'
   ? await guild.client.util.getUser(vote.voted).catch(() => undefined)
   : guild.client.guilds.cache.get(guild.id);
 if (!voted) return;

 guild.client.util.notificationThread(member, {
  embeds: [
   {
    author: {
     name: lan.reminder.name,
     icon_url: guild.client.util.emotes.userFlags.EarlySupporter.link,
    },
    color: CT.Colors.Base,
    description: 'username' in voted ? lan.reminder.descBot(voted) : lan.reminder.descGuild(voted),
   },
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Link,
      label:
       'username' in voted
        ? lan.reminder.voteBotButton(voted)
        : lan.reminder.voteGuildButton(voted),
      url:
       'username' in voted
        ? `https://top.gg/bot/${voted.id}/vote`
        : `https://top.gg/servers/${guild.id}/vote`,
     },
     ...((voted.id === process.env.mainId
      ? []
      : [
         {
          type: Discord.ComponentType.Button,
          style: Discord.ButtonStyle.Link,
          label: lan.reminder.voteAyakoButton,
          url: `https://top.gg/bot/${process.env.mainId}/vote`,
         },
        ]) as Discord.APIButtonComponent[]),
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Secondary,
      label: lan.reminder.reminders,
      emoji: guild.client.util.emotes.enabled,
      custom_id: 'voteReminder/disable',
     },
    ],
   },
  ],
 });
};

export const currency = (r: Prisma.voterewards, user: Discord.User, guild: Discord.Guild) => {
 if (!r.rewardcurrency) return;

 guild.client.util.DataBase.balance
  .upsert({
   where: { userid_guildid: { userid: user.id, guildid: guild.id } },
   update: { balance: { increment: r.rewardcurrency } },
   create: { userid: user.id, guildid: guild.id, balance: r.rewardcurrency },
  })
  .then();
};

export const roles = async (
 r: string[],
 member: Discord.GuildMember | undefined,
 bot: Discord.User,
 language: CT.Language,
) => {
 if (!r.length) return;
 if (!member) return;

 bot.client.util.roleManager.add(member, r, language.events.vote.botReason(bot), 1);
};

export const xp = (r: Prisma.voterewards, user: Discord.User, guild: Discord.Guild) => {
 if (!r.rewardxp) return;

 guild.client.util.DataBase.level
  .upsert({
   where: { userid_guildid_type: { userid: user.id, guildid: guild.id, type: 'guild' } },
   update: { xp: { increment: r.rewardxp } },
   create: { userid: user.id, guildid: guild.id, type: 'guild', xp: r.rewardxp },
  })
  .then();
};

export const xpmultiplier = (r: Prisma.voterewards, user: Discord.User, guild: Discord.Guild) => {
 if (!r.rewardxpmultiplier) return;

 guild.client.util.DataBase.level
  .upsert({
   where: { userid_guildid_type: { userid: user.id, guildid: guild.id, type: 'guild' } },
   update: { xp: r.rewardxpmultiplier },
   create: {
    userid: user.id,
    guildid: guild.id,
    type: 'guild',
    xp: 0,
    multiplier: r.rewardxpmultiplier,
   },
  })
  .then();
};
