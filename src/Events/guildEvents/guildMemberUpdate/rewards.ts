import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (oldMember: Discord.GuildMember, member: Discord.GuildMember) => {
 const rewardSettings = await ch.DataBase.rolerewards.findMany({
  where: {
   guildid: member.guild.id,
   active: true,
   OR: [{ currency: { not: null } }, { customrole: true }],
  },
 });
 if (!rewardSettings.length) return;

 takeRewards(rewardSettings, oldMember, member);

 const settings = rewardSettings.filter(
  (s) =>
   !s.roles.some((r) => oldMember.roles.cache.has(r)) &&
   s.roles.some((r) => member.roles.cache.has(r)) &&
   !s.blroleid.some((r) => member.roles.cache.has(r)) &&
   !s.bluserid.includes(member.user.id),
 );
 if (!settings.length) return;

 doCurrency(settings, member);

 if (!member.guild.rulesChannel) return;

 const thread = await ch.request.channels.createThread(member.guild.rulesChannel, {
  type: Discord.ChannelType.PrivateThread,
  invitable: false,
  name: ch.constants.standard.getEmote(ch.emotes.warning),
 });

 if ('message' in thread) return;

 const xpRewards = settings
  .filter((s) => s.xpmultiplier)
  .map((s) => Number(s.xpmultiplier))
  .reduce((a, b) => a + b, 0);
 const currencyRewards = settings
  .filter((s) => s.currency)
  .map((s) => Number(s.currency))
  .reduce((a, b) => a + b, 0);
 const canCustomRole = !!settings.find((s) => s.customrole);

 const language = await ch.getLanguage(member.guild.id);
 const lan = language.events.guildMemberUpdate.rewards;
 const embed: Discord.APIEmbed = {
  color: ch.constants.colors.success,
  description: lan.desc(settings.map((s) => s.roles).flat()),
  fields: [
   ...(canCustomRole
    ? [
       {
        name: lan.customRoleName,
        value: lan.customRole(member.guild.id),
        inline: false,
       },
      ]
    : []),
   ...(xpRewards
    ? [
       {
        name: lan.xpName,
        value: lan.xp(xpRewards),
        inline: false,
       },
      ]
    : []),
   ...(currencyRewards
    ? [
       {
        name: lan.currencyName,
        value: lan.currency(currencyRewards),
        inline: false,
       },
      ]
    : []),
  ],
 };

 await ch.request.threads.addMember(member.guild, thread.id, member.id);
 await ch.send(thread, {
  embeds: [embed],
  content: `<@${member.id}>`,
  allowed_mentions: {
   users: [member.id],
  },
 });
 await ch.request.channels.edit(thread, { locked: true });
};

const doCurrency = (settings: Prisma.rolerewards[], member: Discord.GuildMember) => {
 const currency = settings.map((s) => Number(s.currency)).reduce((a, b) => a + b, 0);
 if (!currency) return;

 ch.DataBase.balance.upsert({
  where: { userid_guildid: { guildid: member.guild.id, userid: member.id } },
  update: {
   balance: { increment: currency },
  },
  create: {
   balance: currency,
   userid: member.id,
   guildid: member.guild.id,
  },
 });
};

const takeRewards = async (
 rewardSettings: Prisma.rolerewards[],
 oldMember: Discord.GuildMember,
 member: Discord.GuildMember,
) => {
 const settings = rewardSettings.filter(
  (s) =>
   s.roles.some((r) => oldMember.roles.cache.has(r)) &&
   !s.roles.some((r) => member.roles.cache.has(r)) &&
   (s.customrole || s.xpmultiplier),
 );

 if (!settings.length) return;

 const canKeepCustomRole = !!rewardSettings.find(
  (s) => s.customrole && member.roles.cache.some((r) => s.roles.includes(r.id)),
 );
 const customRole = await ch.DataBase.customroles.findUnique({
  where: {
   guildid_userid: {
    guildid: member.guild.id,
    userid: member.id,
   },
  },
 });

 if (canKeepCustomRole || !customRole) return;

 const language = await ch.getLanguage(member.guild.id);

 await ch.request.guilds.deleteRole(
  member.guild,
  customRole.roleid,
  language.events.guildMemberUpdate.rewards.reqLost,
 );
 await ch.DataBase.customroles.delete({
  where: {
   guildid_userid: {
    guildid: member.guild.id,
    userid: member.id,
   },
  },
 });
};
