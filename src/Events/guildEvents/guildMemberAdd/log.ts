import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';

export default async (member: Discord.GuildMember) => {
 const channels = await ch.getLogChannels('memberevents', member.guild);
 if (!channels) return;

 const language = await ch.getLanguage(member.guild.id);
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
  color: CT.Colors.Success,
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

 const flagsText = new Discord.GuildMemberFlagsBitField(member.flags || 0)
  .toArray()
  .map((f) => lan.memberFlags[f])
  .filter((f): f is string => !!f)
  .map((f) => `\`${f}\``)
  .join(', ');

 if (flagsText?.length) {
  embed.fields?.push({
   name: lan.memberFlagsName,
   value: flagsText,
   inline: true,
  });
 }

 ch.send({ id: channels, guildId: member.guild.id }, { embeds: [embed] }, 10000);
};

const getUsedInvite = async (guild: Discord.Guild, user: Discord.User) => {
 if (user.bot) return undefined;

 const oldInvites = Array.from(ch.cache.invites.cache.get(guild.id) ?? [], ([, i]) =>
  Array.from(i, ([c, i2]) => ({ uses: i2, code: c })),
 ).flat();
 const newInvites = await ch.request.guilds
  .getInvites(guild)
  .then((invites) => ('message' in invites ? undefined : invites.map((i) => i)));
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

 const vanity = await ch.request.guilds.getVanityURL(guild);
 if (!vanity) return undefined;
 if ('message' in vanity) return undefined;

 ch.cache.invites.set(vanity, guild.id);
 const parsedVanity = vanity.code ? ch.cache.invites.find(vanity.code as string) : undefined;
 const changedVanity = oldInvites.find((i) => i.code === vanity?.code);
 if (Number(changedVanity?.uses) < Number(parsedVanity)) return parsedVanity;
 return true;
};
