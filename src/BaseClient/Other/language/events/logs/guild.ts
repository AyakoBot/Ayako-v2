import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.logs.guild,
 descBan: (user: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.guild.descBan, {
   user: t.languageFunction.getUser(user),
  }),
 descBanAudit: (user: Discord.User | Discord.PartialUser, executor: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.guild.descBanAudit, {
   executor: t.languageFunction.getUser(executor),
   user: t.languageFunction.getUser(user),
  }),
 descUnban: (user: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.guild.descUnban, {
   user: t.languageFunction.getUser(user),
  }),
 descUnbanAudit: (user: Discord.User | Discord.PartialUser, executor: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.guild.descUnbanAudit, {
   executor: t.languageFunction.getUser(executor),
   user: t.languageFunction.getUser(user),
  }),
 descEmojiCreateAudit: (user: Discord.User | Discord.PartialUser, emoji: Discord.Emoji) =>
  t.stp(t.JSON.events.logs.guild.descEmojiCreateAudit, {
   user: t.languageFunction.getUser(user),
   emoji: t.languageFunction.getEmote(emoji),
  }),
 descEmojiCreate: (emoji: Discord.Emoji) =>
  t.stp(t.JSON.events.logs.guild.descEmojiCreate, {
   emoji: t.languageFunction.getEmote(emoji),
  }),
 descEmojiDeleteAudit: (user: Discord.User | Discord.PartialUser, emoji: Discord.Emoji) =>
  t.stp(t.JSON.events.logs.guild.descEmojiDeleteAudit, {
   user: t.languageFunction.getUser(user),
   emoji: t.languageFunction.getEmote(emoji),
  }),
 descEmojiDelete: (emoji: Discord.Emoji) =>
  t.stp(t.JSON.events.logs.guild.descEmojiDelete, {
   emoji: t.languageFunction.getEmote(emoji),
  }),
 descEmojiUpdateAudit: (user: Discord.User | Discord.PartialUser, emoji: Discord.Emoji) =>
  t.stp(t.JSON.events.logs.guild.descEmojiUpdateAudit, {
   user: t.languageFunction.getUser(user),
   emoji: t.languageFunction.getEmote(emoji),
  }),
 descEmojiUpdate: (emoji: Discord.Emoji) =>
  t.stp(t.JSON.events.logs.guild.descEmojiUpdate, {
   emoji: t.languageFunction.getEmote(emoji),
  }),
 descJoinAudit: (user: Discord.User | Discord.PartialUser, executor: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.guild.descJoinAudit, {
   executor: t.languageFunction.getUser(executor),
   user: t.languageFunction.getUser(user),
  }),
 descMemberJoin: (user: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.guild.descMemberJoin, {
   user: t.languageFunction.getUser(user),
  }),
 descBotJoin: (user: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.guild.descBotJoin, {
   user: t.languageFunction.getUser(user),
  }),
 descBotLeave: (user: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.guild.descBotLeave, {
   user: t.languageFunction.getUser(user),
  }),
 descBotLeaveAudit: (user: Discord.User | Discord.PartialUser, executor: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.guild.descBotLeaveAudit, {
   executor: t.languageFunction.getUser(executor),
   user: t.languageFunction.getUser(user),
  }),
 descMemberLeave: (user: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.guild.descMemberLeave, {
   user: t.languageFunction.getUser(user),
  }),
 descMemberLeaveAudit: (user: Discord.User | Discord.PartialUser, executor: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.guild.descMemberLeaveAudit, {
   executor: t.languageFunction.getUser(executor),
   user: t.languageFunction.getUser(user),
  }),
 descBotUpdate: (user: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.guild.descBotUpdate, {
   user: t.languageFunction.getUser(user),
  }),
 descBotUpdateAudit: (user: Discord.User | Discord.PartialUser, executor: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.guild.descBotUpdateAudit, {
   executor: t.languageFunction.getUser(executor),
   user: t.languageFunction.getUser(user),
  }),
 descMemberUpdate: (user: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.guild.descMemberUpdate, {
   user: t.languageFunction.getUser(user),
  }),
 descMemberUpdateAudit: (user: Discord.User | Discord.PartialUser, executor: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.guild.descMemberUpdateAudit, {
   executor: t.languageFunction.getUser(executor),
   user: t.languageFunction.getUser(user),
  }),
 descGuildUpdate: () => t.JSON.events.logs.guild.descGuildUpdate,
 descGuildUpdateAudit: (executor: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.guild.descGuildUpdateAudit, {
   executor: t.languageFunction.getUser(executor),
  }),
 descAuditLogCreate: (audit: Discord.GuildAuditLogsEntry) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreate, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
  }),
 descAuditLogCreateGuild: (audit: Discord.GuildAuditLogsEntry, guild: Discord.Guild) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreateGuild, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
   guild: t.languageFunction.getGuild(guild),
  }),
 descAuditLogCreateChannel: (audit: Discord.GuildAuditLogsEntry, channel: Discord.GuildChannel) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreateChannel, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
   channel: t.languageFunction.getChannel(channel),
  }),
 descAuditLogCreateUser: (audit: Discord.GuildAuditLogsEntry, user: Discord.User) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreateUser, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
   user: t.languageFunction.getUser(user),
  }),
 descAuditLogCreateRole: (
  audit: Discord.GuildAuditLogsEntry,
  role: Discord.Role | { id: string; name: string },
 ) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreateRole, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
   role: t.languageFunction.getRole(role),
  }),
 descAuditLogCreateInvite: (audit: Discord.GuildAuditLogsEntry, invite: Discord.Invite) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreateInvite, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
   invite: t.languageFunction.getInvite(invite),
  }),
 descAuditLogCreateWebhook: (audit: Discord.GuildAuditLogsEntry, w: Discord.Webhook) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreateWebhook, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
   webhook: t.languageFunction.getWebhook(w),
  }),
 descAuditLogCreateEmoji: (audit: Discord.GuildAuditLogsEntry, emoji: Discord.Emoji) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreateEmoji, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
   emoji: t.languageFunction.getEmote(emoji),
  }),
 descAuditLogCreateMessage: (audit: Discord.GuildAuditLogsEntry, message: Discord.Message) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreateMessage, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
   message: t.languageFunction.getMessage(message),
  }),
 descAuditLogCreateIntegration: (
  audit: Discord.GuildAuditLogsEntry,
  integration: Discord.Integration,
 ) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreateIntegration, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
   integration: t.languageFunction.getIntegration(integration),
  }),
 descAuditLogCreateStageInstance: (
  audit: Discord.GuildAuditLogsEntry,
  stageInstance: Discord.StageInstance,
 ) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreateStageInstance, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
   stageInstance: t.languageFunction.getStageInstance(stageInstance),
  }),
 descAuditLogCreateSticker: (audit: Discord.GuildAuditLogsEntry, s: Discord.Sticker) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreateSticker, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
   sticker: t.languageFunction.getSticker(s),
  }),
 descAuditLogCreateThread: (audit: Discord.GuildAuditLogsEntry, thread: Discord.ThreadChannel) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreateThread, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
   thread: t.languageFunction.getChannel(thread),
  }),
 descAuditLogCreateGuildScheduledEvent: (
  audit: Discord.GuildAuditLogsEntry,
  s: Discord.GuildScheduledEvent,
 ) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreateGuildScheduledEvent, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
   scheduledEvent: t.languageFunction.getScheduledEvent(s),
  }),
 descAuditLogCreateApplicationCommand: (
  audit: Discord.GuildAuditLogsEntry,
  applicationCommand: Discord.ApplicationCommand,
 ) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreateApplicationCommand, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
   command: t.languageFunction.getCommand(applicationCommand),
  }),
 descAuditLogCreateAutoModerationRule: (
  audit: Discord.GuildAuditLogsEntry,
  autoModerationRule: Discord.AutoModerationRule,
 ) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreateAutoModerationRule, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
   autoModerationRule: t.languageFunction.getAutoModerationRule(autoModerationRule),
  }),
 descAuditLogCreateAutoModeration: (
  audit: Discord.GuildAuditLogsEntry,
  member: Discord.GuildMember,
  rule: Discord.AutoModerationRule,
 ) =>
  t.stp(t.JSON.events.logs.guild.descAuditLogCreateAutoModeration, {
   audit: t.languageFunction.getAuditLog(audit),
   executor: audit.executor ? t.languageFunction.getUser(audit.executor) : '',
   member: t.languageFunction.getUser(member.user),
   autoModerationRule: t.languageFunction.getAutoModerationRule(rule),
  }),
 descMemberPrune: (executor: Discord.User | Discord.PartialUser, amount: number, days: number) =>
  t.stp(t.JSON.events.logs.guild.descMemberPrune, {
   executor: t.languageFunction.getUser(executor),
   amount: `${amount}`,
   days: `${days}`,
  }),
 welcomeChannelEmoji: (channel: Discord.GuildChannel) =>
  t.stp(t.JSON.events.logs.guild.welcomeChannelEmoji, {
   channel: t.languageFunction.getChannel(channel),
  }),
 defaultMessageNotifications: {
  0: t.JSON.events.logs.guild.defaultMessageNotifications[0],
  1: t.JSON.events.logs.guild.defaultMessageNotifications[1],
 },
 explicitContentFilter: {
  0: t.JSON.events.logs.guild.explicitContentFilter[0],
  1: t.JSON.events.logs.guild.explicitContentFilter[1],
  2: t.JSON.events.logs.guild.explicitContentFilter[2],
 },
 mfaLevel: {
  0: t.JSON.events.logs.guild.mfaLevel[0],
  1: t.JSON.events.logs.guild.mfaLevel[1],
 },
 nsfwLevel: {
  0: t.JSON.events.logs.guild.nsfwLevel[0],
  1: t.JSON.events.logs.guild.nsfwLevel[1],
  2: t.JSON.events.logs.guild.nsfwLevel[2],
  3: t.JSON.events.logs.guild.nsfwLevel[3],
 },
 verificationLevel: {
  0: t.JSON.events.logs.guild.verificationLevel[0],
  1: t.JSON.events.logs.guild.verificationLevel[1],
  2: t.JSON.events.logs.guild.verificationLevel[2],
  3: t.JSON.events.logs.guild.verificationLevel[3],
  4: t.JSON.events.logs.guild.verificationLevel[4],
 },
});
