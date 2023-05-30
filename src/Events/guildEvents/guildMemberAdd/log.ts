import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (member: Discord.GuildMember) => {
 const channels = await ch.getLogChannels('memberevents', member.guild);
 if (!channels) return;

 const language = await ch.languageSelector(member.guild.id);
 const lan = language.events.logs.guild;
 const con = ch.constants.events.logs.guild;

 const audit = member.user.bot ? await ch.getAudit(member.guild, 28, member.id) : undefined;
 const auditUser = audit?.executor ?? undefined;
 let description = auditUser ? lan.descJoinAudit(member.user, auditUser) : undefined;

 if (!description) {
  description = member.user.bot ? lan.descBotJoin(member.user) : lan.descMemberJoin(member.user);
 }

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: member.user.bot ? con.BotCreate : con.MemberCreate,
   name: member.user.bot ? lan.botJoin : lan.memberJoin,
  },
  description,
  fields: [],
  color: ch.constants.colors.success,
  timestamp: new Date().toISOString(),
 };

 const usedInvite = await getUsedInvite(member.guild, member.user);
 if (usedInvite && typeof usedInvite !== 'boolean') {
  const inviter =
   usedInvite.inviter ??
   (usedInvite.inviterId ? await ch.getUser(usedInvite.inviterId) : undefined);

  embed.fields?.push({
   name: lan.invite,
   value: language.languageFunction.getInviteDetails(
    usedInvite,
    inviter,
    usedInvite.channel ? language.channelTypes[usedInvite.channel.type] : undefined,
   ),
  });
 } else if (usedInvite) {
  embed.fields?.push({
   name: lan.invite,
   value: lan.discovery,
  });
 }

 ch.send({ id: channels, guildId: member.guild.id }, { embeds: [embed] }, undefined, 10000);
};

const getUsedInvite = async (guild: Discord.Guild, user: Discord.User) => {
 if (user.bot) return undefined;

 const oldInvites = Array.from(ch.cache.invites.cache.get(guild.id) ?? [], ([, i]) =>
  Array.from(i, ([c, i2]) => ({ uses: i2, code: c })),
 ).flat();
 const newInvites = await guild.invites.fetch();
 if (!newInvites) return undefined;

 newInvites.forEach((i) => ch.cache.invites.set(i, guild.id));
 if (!oldInvites) return undefined;

 const inv = oldInvites
  .map((oldInvite) => {
   const newInvite = newInvites.find((invite) => invite.code === oldInvite.code);
   if (newInvite && Number(oldInvite.uses) < Number(newInvite.uses)) return newInvite;
   return undefined;
  })
  .filter((i): i is Discord.Invite => !!i)[0];
 if (inv) return inv;

 const vanity = (await guild.fetchVanityData().catch(() => undefined)) as
  | {
     inviter: Discord.User | undefined;
     inviterId: string;
     guild: Discord.Guild;
     code: string | null;
     uses: number;
     channel: Discord.NonThreadGuildBasedChannel | null;
     channelId: string | null;
    }
  | undefined;

 if (vanity) {
  vanity.inviter = (await ch.getUser(guild.ownerId).catch(() => undefined)) as Discord.User;
  vanity.inviterId = guild.ownerId;
  vanity.guild = guild;
  vanity.channel = (guild.channels.cache.get(guild.id) ??
   guild.channels.cache.first()) as Discord.NonThreadGuildBasedChannel;
  vanity.channelId = vanity.channel?.id;
 }

 const cachedVanity = oldInvites.find((i) => i.code === vanity?.code);
 ch.cache.invites.set(vanity as Discord.Invite, guild.id);
 if (Number(cachedVanity?.uses) < Number(vanity?.uses)) return vanity as Discord.Invite;

 return true;
};
