import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (member: Discord.GuildMember) => {
 const channels = await member.client.util.getLogChannels('memberevents', member.guild);
 if (!channels) return;

 const language = await member.client.util.getLanguage(member.guild.id);
 const lan = language.events.logs.guild;
 const con = member.client.util.constants.events.logs.guild;
 const audit = member.user.bot
  ? await member.client.util.getAudit(member.guild, 20, member.user.id)
  : undefined;
 const auditUser = audit?.executor ?? undefined;
 let description = '';

 if (member.user.bot) {
  if (audit && auditUser) description = lan.descBotLeaveAudit(member.user, auditUser);
  else description = lan.descBotLeave(member.user);
 } else if (audit && auditUser) description = lan.descMemberLeaveAudit(member.user, auditUser);
 else description = lan.descMemberLeave(member.user);

 let name = member.user.bot ? lan.botLeave : lan.memberLeave;
 if (audit) name = member.user.bot ? lan.botKick : lan.memberKick;

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: member.user.bot ? con.BotDelete : con.MemberDelete,
   name,
  },
  description,
  fields: [
   {
    name: language.t.Roles,
    value: member.roles.cache.map((r) => `<@&${r.id}>`).join(', '),
   },
  ],
  color: CT.Colors.Danger,
  timestamp: new Date().toISOString(),
 };

 if (member.joinedAt) {
  embed.fields?.push({
   name: language.t.joinedAt,
   value: member.client.util.constants.standard.getTime(member.joinedAt.getTime()),
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

 member.client.util.send({ id: channels, guildId: member.guild.id }, { embeds: [embed] }, 10000);
};
