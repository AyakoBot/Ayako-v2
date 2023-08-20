import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
import cache from '../cache.js';

export default {
 getPreview: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getPreview(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 create: (guild: Discord.Guild, body: Discord.RESTPostAPIGuildsJSONBody) =>
  (cache.apis.get(guild.id) ?? API).guilds.create(body).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 edit: (guild: Discord.Guild, body: Discord.RESTPatchAPIGuildJSONBody) =>
  (cache.apis.get(guild.id) ?? API).guilds.edit(guild.id, body).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 delete: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.delete(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getMembers: (guild: Discord.Guild, query?: Discord.RESTGetAPIGuildMembersQuery) =>
  (cache.apis.get(guild.id) ?? API).guilds.getMembers(guild.id, query).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getChannels: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getChannels(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 createChannel: (
  guild: Discord.Guild,
  body: Discord.RESTPostAPIGuildChannelJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds.createChannel(guild.id, body, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 setChannelPositions: (
  guild: Discord.Guild,
  body: Discord.RESTPatchAPIGuildChannelPositionsJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .setChannelPositions(guild.id, body, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 getActiveThreads: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getActiveThreads(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getMemberBan: (guild: Discord.Guild, query?: Discord.RESTGetAPIGuildBansQuery) =>
  (cache.apis.get(guild.id) ?? API).guilds.getMemberBans(guild.id, query).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 banUser: (
  guild: Discord.Guild,
  userId: string,
  body?: Discord.RESTPutAPIGuildBanJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .banUser(guild.id, userId, body, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 unbanUser: (guild: Discord.Guild, userId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.unbanUser(guild.id, userId, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getRoles: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getRoles(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 createRole: (guild: Discord.Guild, body: Discord.RESTPostAPIGuildRoleJSONBody, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.createRole(guild.id, body, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 setRolePositions: (
  guild: Discord.Guild,
  body: Discord.RESTPatchAPIGuildRolePositionsJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .setRolePositions(guild.id, body, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 editRole: (
  guild: Discord.Guild,
  roleId: string,
  body: Discord.RESTPatchAPIGuildRoleJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .editRole(guild.id, roleId, body, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 deleteRole: (guild: Discord.Guild, roleId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.deleteRole(guild.id, roleId, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 editMFALevel: (guild: Discord.Guild, level: Discord.GuildMFALevel, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.editMFALevel(guild.id, level, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getPruneCount: (guild: Discord.Guild, query?: Discord.RESTGetAPIGuildPruneCountQuery) =>
  (cache.apis.get(guild.id) ?? API).guilds.getPruneCount(guild.id, query).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 beginPrune: (
  guild: Discord.Guild,
  body?: Discord.RESTPostAPIGuildPruneJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds.beginPrune(guild.id, body, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getVoiceRegions: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getVoiceRegions(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getInvites: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getInvites(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getIntegrations: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getIntegrations(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 deleteIntegration: (guild: Discord.Guild, integrationId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .deleteIntegration(guild.id, integrationId, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 getWidgetSettings: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getWidgetSettings(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 editWidgetSettings: (
  guild: Discord.Guild,
  body: Discord.RESTPatchAPIGuildWidgetSettingsJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .editWidgetSettings(guild.id, body, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 getWidget: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getWidget(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getVanityURL: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getVanityURL(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getWidgetImage: (guild: Discord.Guild, style?: Discord.GuildWidgetStyle) =>
  (cache.apis.get(guild.id) ?? API).guilds.getWidgetImage(guild.id, style).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getWelcomeScreen: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getWelcomeScreen(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 editWelcomeScreen: (
  guild: Discord.Guild,
  body: Discord.RESTPatchAPIGuildWelcomeScreenJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .editWelcomeScreen(guild.id, body, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 editUserVoiceState: (
  guild: Discord.Guild,
  userId: string,
  body: Discord.RESTPatchAPIGuildVoiceStateUserJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .editUserVoiceState(guild.id, userId, body, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 getEmojis: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getEmojis(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getEmoji: (guild: Discord.Guild, emojiId: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.getEmoji(guild.id, emojiId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 createEmoji: (
  guild: Discord.Guild,
  body: Discord.RESTPostAPIGuildEmojiJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds.createEmoji(guild.id, body, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 editEmoji: (
  guild: Discord.Guild,
  emojiId: string,
  body: Discord.RESTPatchAPIGuildEmojiJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .editEmoji(guild.id, emojiId, body, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 deleteEmoji: (guild: Discord.Guild, emojiId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.deleteEmoji(guild.id, emojiId, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getScheduledEvents: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getScheduledEvents(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 createScheduledEvent: (
  guild: Discord.Guild,
  body: Discord.RESTPostAPIGuildScheduledEventJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .createScheduledEvent(guild.id, body, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 getScheduledEvent: (
  guild: Discord.Guild,
  eventId: string,
  query?: Discord.RESTGetAPIGuildScheduledEventQuery,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .getScheduledEvent(guild.id, eventId, query)
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 editScheduledEvent: (
  guild: Discord.Guild,
  eventId: string,
  body: Discord.RESTPatchAPIGuildScheduledEventJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .editScheduledEvent(guild.id, eventId, body, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 deleteScheduledEvent: (guild: Discord.Guild, eventId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .deleteScheduledEvent(guild.id, eventId, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 getScheduledEventUsers: (
  guild: Discord.Guild,
  eventId: string,
  query?: Discord.RESTGetAPIGuildScheduledEventUsersQuery,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .getScheduledEventUsers(guild.id, eventId, query)
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 getTemplates: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getTemplates(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 syncTemplate: (guild: Discord.Guild, templateCode: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.syncTemplate(guild.id, templateCode).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 editTemplate: (
  guild: Discord.Guild,
  templateCode: string,
  body: Discord.RESTPatchAPIGuildTemplateJSONBody,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds.editTemplate(guild.id, templateCode, body).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 deleteTemplate: (guild: Discord.Guild, templateCode: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.deleteTemplate(guild.id, templateCode).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getStickers: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getStickers(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getSticker: (guild: Discord.Guild, stickerId: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.getSticker(guild.id, stickerId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 createSticker: (
  guild: Discord.Guild,
  body: Omit<Discord.RESTPostAPIGuildStickerFormDataBody, 'file'> & {
   file: Discord.RawFile;
  },
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds.createSticker(guild.id, body, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 editSticker: (
  guild: Discord.Guild,
  stickerId: string,
  body: Discord.RESTPatchAPIGuildStickerJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .editSticker(guild.id, stickerId, body, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 deleteSticker: (guild: Discord.Guild, stickerId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .deleteSticker(guild.id, stickerId, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 getAuditLogs: (guild: Discord.Guild, query?: Discord.RESTGetAPIAuditLogQuery) =>
  (cache.apis.get(guild.id) ?? API).guilds.getAuditLogs(guild.id, query).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getAutoModerationRules: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getAutoModerationRules(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getAutoModerationRule: (guild: Discord.Guild, ruleId: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.getAutoModerationRule(guild.id, ruleId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 createAutoModerationRule: (
  guild: Discord.Guild,
  body: Discord.RESTPostAPIAutoModerationRuleJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .createAutoModerationRule(guild.id, body, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 editAutoModerationRule: (
  guild: Discord.Guild,
  ruleId: string,
  body: Discord.RESTPatchAPIAutoModerationRuleJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .editAutoModerationRule(guild.id, ruleId, body, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 deleteAutoModerationRule: (guild: Discord.Guild, ruleId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .deleteAutoModerationRule(guild.id, ruleId, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 getMember: (guild: Discord.Guild, userId: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.getMember(guild.id, userId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 searchForMembers: (guild: Discord.Guild, query: Discord.RESTGetAPIGuildMembersSearchQuery) =>
  (cache.apis.get(guild.id) ?? API).guilds.searchForMembers(guild.id, query).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 editMember: (
  guild: Discord.Guild,
  userId: string,
  body: Discord.RESTPatchAPIGuildMemberJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .editMember(guild.id, userId, body, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 removeMember: (guild: Discord.Guild, userId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.removeMember(guild.id, userId, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 addRoleToMember: (guild: Discord.Guild, userId: string, roleId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .addRoleToMember(guild.id, userId, roleId, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 removeRoleFromMember: (guild: Discord.Guild, userId: string, roleId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .removeRoleFromMember(guild.id, userId, roleId, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 getTemplate: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getTemplate(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 createTemplate: (guild: Discord.Guild, body: Discord.RESTPostAPIGuildTemplatesJSONBody) =>
  (cache.apis.get(guild.id) ?? API).guilds.createTemplate(guild.id, body).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 setVoiceState: (
  guild: Discord.Guild,
  body?: Discord.RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds.setVoiceState(guild.id, body).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getOnboarding: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getOnboarding(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
};
