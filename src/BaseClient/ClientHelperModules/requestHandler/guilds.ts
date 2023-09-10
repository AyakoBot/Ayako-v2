import * as Discord from 'discord.js';
import error from '../error.js';
import { API } from '../../Client.js';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';

export default {
 getPreview: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getPreview(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 create: (guild: Discord.Guild, body: Discord.RESTPostAPIGuildsJSONBody) =>
  (cache.apis.get(guild.id) ?? API).guilds.create(body).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 edit: (guild: Discord.Guild, body: Discord.RESTPatchAPIGuildJSONBody) =>
  (cache.apis.get(guild.id) ?? API).guilds.edit(guild.id, body).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 delete: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.delete(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getMembers: (guild: Discord.Guild, query?: Discord.RESTGetAPIGuildMembersQuery) =>
  (cache.apis.get(guild.id) ?? API).guilds.getMembers(guild.id, query).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getChannels: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getChannels(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 createChannel: (
  guild: Discord.Guild,
  body: Discord.RESTPostAPIGuildChannelJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds.createChannel(guild.id, body, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
   }),
 getActiveThreads: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getActiveThreads(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getMemberBan: (guild: Discord.Guild, userId: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.getMemberBan(guild.id, userId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
   }),
 unbanUser: (guild: Discord.Guild, userId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.unbanUser(guild.id, userId, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getRoles: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getRoles(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 createRole: (guild: Discord.Guild, body: Discord.RESTPostAPIGuildRoleJSONBody, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.createRole(guild.id, body, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
   }),
 deleteRole: (guild: Discord.Guild, roleId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.deleteRole(guild.id, roleId, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 editMFALevel: (guild: Discord.Guild, level: Discord.GuildMFALevel, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.editMFALevel(guild.id, level, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getPruneCount: (guild: Discord.Guild, query?: Discord.RESTGetAPIGuildPruneCountQuery) =>
  (cache.apis.get(guild.id) ?? API).guilds.getPruneCount(guild.id, query).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 beginPrune: (
  guild: Discord.Guild,
  body?: Discord.RESTPostAPIGuildPruneJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds.beginPrune(guild.id, body, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getVoiceRegions: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getVoiceRegions(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getInvites: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getInvites(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getIntegrations: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getIntegrations(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 deleteIntegration: (guild: Discord.Guild, integrationId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .deleteIntegration(guild.id, integrationId, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getWidgetSettings: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getWidgetSettings(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
   }),
 getWidget: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getWidget(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getVanityURL: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getVanityURL(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getWidgetImage: (guild: Discord.Guild, style?: Discord.GuildWidgetStyle) =>
  (cache.apis.get(guild.id) ?? API).guilds.getWidgetImage(guild.id, style).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getWelcomeScreen: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getWelcomeScreen(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
   }),
 getEmojis: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getEmojis(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getEmoji: (guild: Discord.Guild, emojiId: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.getEmoji(guild.id, emojiId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 createEmoji: (
  guild: Discord.Guild,
  body: Discord.RESTPostAPIGuildEmojiJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds.createEmoji(guild.id, body, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
   }),
 deleteEmoji: (guild: Discord.Guild, emojiId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.deleteEmoji(guild.id, emojiId, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getScheduledEvents: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getScheduledEvents(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
   }),
 deleteScheduledEvent: (guild: Discord.Guild, eventId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .deleteScheduledEvent(guild.id, eventId, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
   }),
 getTemplates: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getTemplates(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 syncTemplate: (guild: Discord.Guild, templateCode: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.syncTemplate(guild.id, templateCode).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 editTemplate: (
  guild: Discord.Guild,
  templateCode: string,
  body: Discord.RESTPatchAPIGuildTemplateJSONBody,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds.editTemplate(guild.id, templateCode, body).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 deleteTemplate: (guild: Discord.Guild, templateCode: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.deleteTemplate(guild.id, templateCode).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getStickers: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getStickers(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getSticker: (guild: Discord.Guild, stickerId: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.getSticker(guild.id, stickerId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
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
   return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
   }),
 deleteSticker: (guild: Discord.Guild, stickerId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .deleteSticker(guild.id, stickerId, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getAuditLogs: (guild: Discord.Guild, query?: Discord.RESTGetAPIAuditLogQuery) =>
  (cache.apis.get(guild.id) ?? API).guilds.getAuditLogs(guild.id, query).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getAutoModerationRules: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getAutoModerationRules(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getAutoModerationRule: (guild: Discord.Guild, ruleId: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.getAutoModerationRule(guild.id, ruleId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
   }),
 deleteAutoModerationRule: (guild: Discord.Guild, ruleId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .deleteAutoModerationRule(guild.id, ruleId, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getMember: (guild: Discord.Guild, userId: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.getMember(guild.id, userId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 searchForMembers: (guild: Discord.Guild, query: Discord.RESTGetAPIGuildMembersSearchQuery) =>
  (cache.apis.get(guild.id) ?? API).guilds.searchForMembers(guild.id, query).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
   }),
 removeMember: (guild: Discord.Guild, userId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds.removeMember(guild.id, userId, { reason }).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 addRoleToMember: (guild: Discord.Guild, userId: string, roleId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .addRoleToMember(guild.id, userId, roleId, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 removeRoleFromMember: (guild: Discord.Guild, userId: string, roleId: string, reason?: string) =>
  (cache.apis.get(guild.id) ?? API).guilds
   .removeRoleFromMember(guild.id, userId, roleId, { reason })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getTemplate: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getTemplate(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 createTemplate: (guild: Discord.Guild, body: Discord.RESTPostAPIGuildTemplatesJSONBody) =>
  (cache.apis.get(guild.id) ?? API).guilds.createTemplate(guild.id, body).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 setVoiceState: (
  guild: Discord.Guild,
  body?: Discord.RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
 ) =>
  (cache.apis.get(guild.id) ?? API).guilds.setVoiceState(guild.id, body).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getOnboarding: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getOnboarding(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getWebhooks: (guild: Discord.Guild) =>
  (cache.apis.get(guild.id) ?? API).guilds.getWebhooks(guild.id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getMemberBans: (guild: Discord.Guild, query?: Discord.RESTGetAPIGuildBansQuery) =>
  (cache.apis.get(guild.id) ?? API).guilds.getMemberBans(guild.id, query).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
};
