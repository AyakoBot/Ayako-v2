import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';

export default async (invite: Discord.Invite, guild: Discord.Guild) => {
 const channels = await ch.getLogChannels('inviteevents', guild);
 if (!channels) return;

 const language = await ch.getLanguage(guild.id);
 const lan = language.events.logs.invite;
 const con = ch.constants.events.logs.invite;
 const audit = await ch.getAudit(guild, 40, invite.code);
 const auditUser = audit?.executor ?? invite.inviter ?? undefined;

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.create,
   name: lan.nameCreate,
  },
  description: auditUser ? lan.descCreateAudit(auditUser, invite) : lan.descCreate(invite),
  fields: [],
  color: CT.Colors.Success,
  timestamp: new Date().toISOString(),
 };

 const flagsText = [invite.temporary ? lan.temporary : null]
  .filter((f): f is string => !!f)
  .map((f) => `\`${f}\``)
  .join(', ');

 if (flagsText) {
  embed.fields?.push({
   name: lan.flagsName,
   value: flagsText,
   inline: true,
  });
 }

 if (invite.inviter) {
  embed.fields?.push({
   name: lan.inviter,
   value: language.languageFunction.getUser(invite.inviter),
   inline: false,
  });
 }

 if (invite.targetUser) {
  embed.fields?.push({
   name: lan.targetUser,
   value: language.languageFunction.getUser(invite.targetUser),
   inline: false,
  });
 }

 if (invite.targetApplication) {
  embed.fields?.push({
   name: language.t.Application,
   value: language.languageFunction.getApplication(invite.targetApplication),
  });
 }

 if (invite.expiresAt) {
  embed.fields?.push({
   name: lan.expiresAt,
   value: ch.constants.standard.getTime(invite.expiresAt.getTime()),
  });
 }

 const channel = invite.channelId ? guild.channels.cache.get(invite.channelId) : undefined;

 if (channel) {
  embed.fields?.push({
   name: language.t.Channel,
   value: language.languageFunction.getChannel(channel, language.channelTypes[channel.type]),
   inline: false,
  });
 }

 if (invite.guildScheduledEvent) {
  embed.fields?.push({
   name: language.t.ScheduledEvent,
   value: language.languageFunction.getScheduledEvent(invite.guildScheduledEvent),
   inline: false,
  });
 }

 if (invite.maxAge) {
  embed.fields?.push({
   name: lan.maxAge,
   value: ch.moment(invite.maxAge, language),
  });
 }

 if (invite.createdAt) {
  embed.fields?.push({
   name: language.t.createdAt,
   value: ch.constants.standard.getTime(invite.createdAt.getTime()),
  });
 }

 if (invite.targetType) {
  embed.fields?.push({
   name: lan.targetTypeName,
   value: lan.targetType[invite.targetType],
  });
 }

 embed.fields?.push({
  name: lan.maxUses,
  value: String(invite.maxUses || '∞'),
 });

 ch.send({ id: channels, guildId: guild.id }, { embeds: [embed] }, 10000);
};
