import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import Prisma from '@prisma/client';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings.js';

export default async (
 vote: CT.TopGGBotVote,
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

 const bot = await ch.getUser(vote.bot).catch(() => undefined);
 if (!bot) return;

 const language = await ch.languageSelector(guild.id);

 if (!allRewards?.length) {
  doAnnouncement(setting, user, bot, language);
  return;
 }

 const tier = getTier(allRewards, member);
 const rewards = allRewards.filter((r) => Number(r.tier) === tier);

 rewards.forEach((r) => {
  currency(r, user, guild);
  roles(r, member, bot, language);
  xp(r, user, guild);
  xpmultiplier(r, user, guild);

  ch.DataBase.voters
   .upsert({
    where: { userid_voted: { userid: user.id, voted: vote.bot } },
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
     userid: user.id,
     removetime: Date.now() + 43200000,
     voted: vote.bot,
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

export const getTier = (rewards: Prisma.voterewards[], member: Discord.GuildMember | undefined) => {
 if (!member) return 1;

 const doesntHave = rewards
  .filter((r) => r.rewardroles?.length)
  .sort((a, b) => Number(a.tier) - Number(b.tier))
  .find((r) => !member.roles.cache.hasAny(...(r.rewardroles as string[])));

 const highestTier = Math.max(...rewards.map((r) => Number(r.tier)));

 if (doesntHave) {
  if (Number(doesntHave.tier) > highestTier) return Number(highestTier);
  return Number(doesntHave.tier);
 }

 return 1;
};

export const doAnnouncement = async (
 settings: Prisma.votesettings,
 user: Discord.User,
 voted: Discord.User | Discord.Guild,
 language: CT.Language,
 rewards?: Prisma.voterewards[],
) => {
 if (!settings.announcementchannel) return;

 const channel = await ch.getChannel.guildTextChannel(settings.announcementchannel);
 if (!channel) return;

 const currencyRewards = rewards?.filter((r) => !!r.rewardcurrency);
 const lan = language.events.vote;

 const rewardText = rewards?.length
  ? `${lan.reward(
     rewards
      .map((r, i) => {
       switch (i) {
        case 0 && r.rewardroles?.length: {
         return r.rewardroles?.map((roleID) => `<@&${roleID}>`).join(', ');
        }
        case 1: {
         return `${r.rewardxp} XP`;
        }
        case 2: {
         return `${r.rewardxpmultiplier}x ${lan.xpmultiplier}`;
        }
        default: {
         return null;
        }
       }
      })
      .filter((r): r is string => !!r)
      .join(` ${ch.stringEmotes.plusBG} `),
    )}${
     currencyRewards?.length
      ? `${ch.stringEmotes.plusBG} ${currencyRewards
         ?.map((r) => Number(r.rewardcurrency))
         .reduce((b, a) => b + a, 0)} ${ch.stringEmotes.book}`
      : ''
    }`
  : '';

 ch.send(channel, {
  content: `${'username' in voted ? lan.bot(user, voted) : lan.guild(user, voted)}${rewardText}`,
 });
};

export const endVote = async (vote: CT.TopGGBotVote | CT.TopGGGuildVote, g: Discord.Guild) => {
 const now = Date.now();
 const savedRewards = await ch.DataBase.voters.findMany({
  where: {
   userid: vote.user,
   voted: 'bot' in vote ? vote.bot : vote.guild,
   removetime: { lt: now },
  },
 });
 if (!savedRewards) return;

 await ch.DataBase.voters.deleteMany({
  where: {
   userid: vote.user,
   voted: 'bot' in vote ? vote.bot : vote.guild,
   removetime: { lt: now },
  },
 });

 const guild = client.guilds.cache.get(g.id);
 if (!guild) return;

 const member = await ch.request.guilds
  .getMember(guild, vote.user)
  .then((m) => ('message' in m ? undefined : m));
 if (!member) return;

 const language = await ch.languageSelector(guild.id);
 const lan = language.events.vote;

 ch.roleManager.remove(
  member,
  savedRewards
   .filter((r) => r.rewardroles?.length)
   .map((r) => r.rewardroles)
   .filter((r): r is string[] => !!r)
   .flat(),
  language.events.vote.endReason,
  1,
 );

 const userSettings = await ch.DataBase.users.findUnique({ where: { userid: member.user.id } });
 if (userSettings && !userSettings.votereminders) return;

 const voted =
  'bot' in vote ? await ch.getUser(vote.bot).catch(() => undefined) : client.guilds.cache.get(g.id);
 if (!voted) return;

 ch.send(member, {
  embeds: [
   {
    author: {
     name: lan.reminder.name,
     icon_url: ch.objectEmotes.userFlags.EarlySupporter.link,
    },
    color: ch.constants.colors.base,
    description: 'username' in voted ? lan.reminder.descBot(voted) : lan.reminder.descGuild(voted),
    fields: [
     {
      name: '\u200b',
      value: 'username' in voted ? lan.reminder.voteBot(voted) : lan.reminder.voteGuild(voted),
     },
    ],
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
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Link,
      label: lan.reminder.voteAyakoButton,
      url: `https://top.gg/bot/${client.user?.id}/vote`,
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Danger,
      label: lan.reminder.disable,
      custom_id: `voteReminder_${'bot' in vote ? 'bot' : 'guild'}_disable_${voted.id}`,
     },
    ],
   },
  ],
 });
};

export const currency = (r: Prisma.voterewards, user: Discord.User, guild: Discord.Guild) => {
 if (!r.rewardcurrency) return;

 ch.DataBase.balance
  .upsert({
   where: { userid_guildid: { userid: user.id, guildid: guild.id } },
   update: {
    balance: { increment: r.rewardcurrency },
   },
   create: {
    userid: user.id,
    guildid: guild.id,
    balance: r.rewardcurrency,
   },
  })
  .then();
};

export const roles = async (
 r: Prisma.voterewards,
 member: Discord.GuildMember | undefined,
 bot: Discord.User,
 language: CT.Language,
) => {
 if (!r.rewardroles?.length) return;
 if (!member) return;

 const me = await ch.getBotMemberFromGuild(member.guild);
 if (!me) {
  ch.error(member.guild, new Error("I can't find myself in this guild!"));
  return;
 }

 if (!ch.isManageable(member, me)) return;

 ch.roleManager.add(member, r.rewardroles, language.events.vote.botReason(bot), 1);
};

export const xp = (r: Prisma.voterewards, user: Discord.User, guild: Discord.Guild) => {
 if (!r.rewardxp) return;

 ch.DataBase.level
  .upsert({
   where: { userid_guildid_type: { userid: user.id, guildid: guild.id, type: 'guild' } },
   update: {
    xp: { increment: r.rewardxp },
   },
   create: {
    userid: user.id,
    guildid: guild.id,
    type: 'guild',
    xp: r.rewardxp,
    level: 0,
   },
  })
  .then();
};

export const xpmultiplier = (r: Prisma.voterewards, user: Discord.User, guild: Discord.Guild) => {
 if (!r.rewardxpmultiplier) return;

 ch.DataBase.level
  .upsert({
   where: { userid_guildid_type: { userid: user.id, guildid: guild.id, type: 'guild' } },
   update: {
    xp: r.rewardxpmultiplier,
   },
   create: {
    userid: user.id,
    guildid: guild.id,
    type: 'guild',
    xp: 0,
    multiplier: r.rewardxpmultiplier,
    level: 0,
   },
  })
  .then();
};
