import importCache from '../importCache/BaseClient/UtilModules/requestHandler/guilds.js';

interface Guilds {
 edit: typeof importCache.edit.file.default;
 delete: typeof importCache.delete.file.default;
 getChannels: typeof importCache.getChannels.file.default;
 getWidgetImage: typeof importCache.getWidgetImage.file.default;
 getVanityURL: typeof importCache.getVanityURL.file.default;
 getWelcomeScreen: typeof importCache.getWelcomeScreen.file.default;
 editWelcomeScreen: typeof importCache.editWelcomeScreen.file.default;
 getWidgetSettings: typeof importCache.getWidgetSettings.file.default;
 editWidgetSettings: typeof importCache.editWidgetSettings.file.default;
 getWidget: typeof importCache.getWidget.file.default;
 getInvites: typeof importCache.getInvites.file.default;
 getIntegrations: typeof importCache.getIntegrations.file.default;
 deleteIntegration: typeof importCache.deleteIntegration.file.default;
 getVoiceRegions: typeof importCache.getVoiceRegions.file.default;
 beginPrune: typeof importCache.beginPrune.file.default;
 getAuditLogs: typeof importCache.getAuditLogs.file.default;
 getAutoModerationRules: typeof importCache.getAutoModerationRules.file.default;
 getAutoModerationRule: typeof importCache.getAutoModerationRule.file.default;
 createAutoModerationRule: typeof importCache.createAutoModerationRule.file.default;
 editAutoModerationRule: typeof importCache.editAutoModerationRule.file.default;
 deleteAutoModerationRule: typeof importCache.deleteAutoModerationRule.file.default;
 getEmojis: typeof importCache.getEmojis.file.default;
 getEmoji: typeof importCache.getEmoji.file.default;
 createEmoji: typeof importCache.createEmoji.file.default;
 editEmoji: typeof importCache.editEmoji.file.default;
 deleteEmoji: typeof importCache.deleteEmoji.file.default;
 getMembers: typeof importCache.getMembers.file.default;
 getMember: typeof importCache.getMember.file.default;
 searchForMembers: typeof importCache.searchForMembers.file.default;
 editMember: typeof importCache.editMember.file.default;
 removeMember: typeof importCache.removeMember.file.default;
 addRoleToMember: typeof importCache.addRoleToMember.file.default;
 removeRoleFromMember: typeof importCache.removeRoleFromMember.file.default;
 getRoles: typeof importCache.getRoles.file.default;
 createRole: typeof importCache.createRole.file.default;
 editRole: typeof importCache.editRole.file.default;
 deleteRole: typeof importCache.deleteRole.file.default;
 getPruneCount: typeof importCache.getPruneCount.file.default;
 deleteScheduledEvent: typeof importCache.deleteScheduledEvent.file.default;
 editScheduledEvent: typeof importCache.editScheduledEvent.file.default;
 createScheduledEvent: typeof importCache.createScheduledEvent.file.default;
 getScheduledEvent: typeof importCache.getScheduledEvent.file.default;
 getScheduledEvents: typeof importCache.getScheduledEvents.file.default;
 getScheduledEventUsers: typeof importCache.getScheduledEventUsers.file.default;
 getStickers: typeof importCache.getStickers.file.default;
 getSticker: typeof importCache.getSticker.file.default;
 createSticker: typeof importCache.createSticker.file.default;
 editSticker: typeof importCache.editSticker.file.default;
 deleteSticker: typeof importCache.deleteSticker.file.default;
 getTemplates: typeof importCache.getTemplates.file.default;
 getTemplate: typeof importCache.getTemplate.file.default;
 createTemplate: typeof importCache.createTemplate.file.default;
 editTemplate: typeof importCache.editTemplate.file.default;
 deleteTemplate: typeof importCache.deleteTemplate.file.default;
 getWebhooks: typeof importCache.getWebhooks.file.default;
 getMemberBans: typeof importCache.getMemberBans.file.default;
 getOnboarding: typeof importCache.getOnboarding.file.default;
 setVoiceState: typeof importCache.setVoiceState.file.default;
 syncTemplate: typeof importCache.syncTemplate.file.default;
 editUserVoiceState: typeof importCache.editUserVoiceState.file.default;
 editMFALevel: typeof importCache.editMFALevel.file.default;
 getPreview: typeof importCache.getPreview.file.default;
 create: typeof importCache.create.file.default;
 createChannel: typeof importCache.createChannel.file.default;
 setChannelPositions: typeof importCache.setChannelPositions.file.default;
 getActiveThreads: typeof importCache.getActiveThreads.file.default;
 getMemberBan: typeof importCache.getMemberBan.file.default;
 banMember: typeof importCache.banMember.file.default;
 banUser: typeof importCache.banUser.file.default;
 unbanUser: typeof importCache.unbanUser.file.default;
 setRolePositions: typeof importCache.setRolePositions.file.default;
}

/**
 * This module contains methods for interacting with guilds in Discord.
 * @property {Function} edit
 * - Edits a guild.
 * @property {Function} delete
 * - Deletes a guild.
 * @property {Function} getChannels
 * - Gets the channels in a guild.
 * @property {Function} getWidgetImage
 * - Gets the widget image for a guild.
 * @property {Function} getVanityURL
 * - Gets the vanity URL for a guild.
 * @property {Function} getWelcomeScreen
 * - Gets the welcome screen for a guild.
 * @property {Function} editWelcomeScreen
 * - Edits the welcome screen for a guild.
 * @property {Function} getWidgetSettings
 * - Gets the widget settings for a guild.
 * @property {Function} editWidgetSettings
 * - Edits the widget settings for a guild.
 * @property {Function} getWidget
 * - Gets the widget for a guild.
 * @property {Function} getInvites
 * - Gets the invites for a guild.
 * @property {Function} getIntegrations
 * - Gets the integrations for a guild.
 * @property {Function} deleteIntegration
 * - Deletes an integration for a guild.
 * @property {Function} getVoiceRegions
 * - Gets the voice regions for a guild.
 * @property {Function} beginPrune
 * - Begins a prune operation for a guild.
 * @property {Function} getAuditLogs
 * - Gets the audit logs for a guild.
 * @property {Function} getAutoModerationRules
 * - Gets the auto-moderation rules for a guild.
 * @property {Function} getAutoModerationRule
 * - Gets an auto-moderation rule for a guild.
 * @property {Function} createAutoModerationRule
 * - Creates an auto-moderation rule for a guild.
 * @property {Function} editAutoModerationRule
 * - Edits an auto-moderation rule for a guild.
 * @property {Function} deleteAutoModerationRule
 * - Deletes an auto-moderation rule for a guild.
 * @property {Function} getEmojis
 * - Gets the emojis for a guild.
 * @property {Function} getEmoji
 * - Gets an emoji for a guild.
 * @property {Function} createEmoji
 * - Creates an emoji for a guild.
 * @property {Function} editEmoji
 * - Edits an emoji for a guild.
 * @property {Function} deleteEmoji
 * - Deletes an emoji for a guild.
 * @property {Function} getMembers
 * - Gets the members for a guild.
 * @property {Function} getMember
 * - Gets a member for a guild.
 * @property {Function} searchForMembers
 * - Searches for members in a guild.
 * @property {Function} editMember
 * - Edits a member in a guild.
 * @property {Function} removeMember
 * - Removes a member from a guild.
 * @property {Function} addRoleToMember
 * - Adds a role to a member in a guild.
 * @property {Function} removeRoleFromMember
 * - Removes a role from a member in a guild.
 * @property {Function} getRoles
 * - Gets the roles for a guild.
 * @property {Function} createRole
 * - Creates a role for a guild.
 * @property {Function} editRole
 * - Edits a role for a guild.
 * @property {Function} deleteRole
 * - Deletes a role for a guild.
 * @property {Function} getPruneCount
 * - Gets the prune count for a guild.
 * @property {Function} deleteScheduledEvent
 * - Deletes a scheduled event for a guild.
 * @property {Function} editScheduledEvent
 * - Edits a scheduled event for a guild.
 * @property {Function} createScheduledEvent
 * - Creates a scheduled event for a guild.
 * @property {Function} getScheduledEvent
 * - Gets a scheduled event for a guild.
 * @property {Function} getScheduledEvents
 * - Gets the scheduled events for a guild.
 * @property {Function} getScheduledEventUsers
 * - Gets the users for a scheduled event in a guild.
 * @property {Function} getStickers
 * - Gets the stickers for a guild.
 * @property {Function} getSticker
 * - Gets a sticker for a guild.
 * @property {Function} createSticker
 * - Creates a sticker for a guild.
 * @property {Function} editSticker
 * - Edits a sticker for a guild.
 * @property {Function} deleteSticker
 * - Deletes a sticker for a guild.
 * @property {Function} getTemplates
 * - Gets the templates for a guild.
 * @property {Function} getTemplate
 * - Gets a template for a guild.
 * @property {Function} createTemplate
 * - Creates a template for a guild.
 * @property {Function} editTemplate
 * - Edits a template for a guild.
 * @property {Function} deleteTemplate
 * - Deletes a template for a guild.
 * @property {Function} getWebhooks
 * - Gets the webhooks for a guild.
 * @property {Function} getMemberBans
 * - Gets the bans for a guild.
 * @property {Function} getOnboarding
 * - Gets the onboarding for a guild.
 * @property {Function} setVoiceState
 * - Sets the voice state for a guild.
 * @property {Function} syncTemplate
 * - Syncs a template for a guild.
 * @property {Function} editUserVoiceState
 * - Edits the voice state for a user in a guild.
 * @property {Function} editMFALevel
 * - Edits the MFA level for a guild.
 * @property {Function} getPreview
 * - Gets the preview for a guild.
 * @property {Function} create
 * - Creates a guild.
 * @property {Function} createChannel
 * - Creates a channel in a guild.
 * @property {Function} setChannelPositions
 * - Sets the positions of channels in a guild.
 * @property {Function} getActiveThreads
 * - Gets the active threads in a guild.
 * @property {Function} getMemberBan
 * - Gets a ban for a member in a guild.
 * @property {Function} banMember
 * - Bans a member from a guild.
 * @property {Function} banUser
 * - Bans a user from a guild.
 * @property {Function} unbanUser
 * - Unbans a user from a guild.
 * @property {Function} getRolePositions
 * - Gets the positions of roles in a guild.
 */
const guilds: Guilds = {
 edit: importCache.edit.file.default,
 delete: importCache.delete.file.default,
 getChannels: importCache.getChannels.file.default,
 getWidgetImage: importCache.getWidgetImage.file.default,
 getVanityURL: importCache.getVanityURL.file.default,
 getWelcomeScreen: importCache.getWelcomeScreen.file.default,
 editWelcomeScreen: importCache.editWelcomeScreen.file.default,
 getWidgetSettings: importCache.getWidgetSettings.file.default,
 editWidgetSettings: importCache.editWidgetSettings.file.default,
 getWidget: importCache.getWidget.file.default,
 getInvites: importCache.getInvites.file.default,
 getIntegrations: importCache.getIntegrations.file.default,
 deleteIntegration: importCache.deleteIntegration.file.default,
 getVoiceRegions: importCache.getVoiceRegions.file.default,
 beginPrune: importCache.beginPrune.file.default,
 getAuditLogs: importCache.getAuditLogs.file.default,
 getAutoModerationRules: importCache.getAutoModerationRules.file.default,
 getAutoModerationRule: importCache.getAutoModerationRule.file.default,
 createAutoModerationRule: importCache.createAutoModerationRule.file.default,
 editAutoModerationRule: importCache.editAutoModerationRule.file.default,
 deleteAutoModerationRule: importCache.deleteAutoModerationRule.file.default,
 getEmojis: importCache.getEmojis.file.default,
 getEmoji: importCache.getEmoji.file.default,
 createEmoji: importCache.createEmoji.file.default,
 editEmoji: importCache.editEmoji.file.default,
 deleteEmoji: importCache.deleteEmoji.file.default,
 getMembers: importCache.getMembers.file.default,
 getMember: importCache.getMember.file.default,
 searchForMembers: importCache.searchForMembers.file.default,
 editMember: importCache.editMember.file.default,
 removeMember: importCache.removeMember.file.default,
 addRoleToMember: importCache.addRoleToMember.file.default,
 removeRoleFromMember: importCache.removeRoleFromMember.file.default,
 getRoles: importCache.getRoles.file.default,
 createRole: importCache.createRole.file.default,
 editRole: importCache.editRole.file.default,
 deleteRole: importCache.deleteRole.file.default,
 getPruneCount: importCache.getPruneCount.file.default,
 deleteScheduledEvent: importCache.deleteScheduledEvent.file.default,
 editScheduledEvent: importCache.editScheduledEvent.file.default,
 createScheduledEvent: importCache.createScheduledEvent.file.default,
 getScheduledEvent: importCache.getScheduledEvent.file.default,
 getScheduledEvents: importCache.getScheduledEvents.file.default,
 getScheduledEventUsers: importCache.getScheduledEventUsers.file.default,
 getStickers: importCache.getStickers.file.default,
 getSticker: importCache.getSticker.file.default,
 createSticker: importCache.createSticker.file.default,
 editSticker: importCache.editSticker.file.default,
 deleteSticker: importCache.deleteSticker.file.default,
 getTemplates: importCache.getTemplates.file.default,
 getTemplate: importCache.getTemplate.file.default,
 createTemplate: importCache.createTemplate.file.default,
 editTemplate: importCache.editTemplate.file.default,
 deleteTemplate: importCache.deleteTemplate.file.default,
 getWebhooks: importCache.getWebhooks.file.default,
 getMemberBans: importCache.getMemberBans.file.default,
 getOnboarding: importCache.getOnboarding.file.default,
 setVoiceState: importCache.setVoiceState.file.default,
 syncTemplate: importCache.syncTemplate.file.default,
 editUserVoiceState: importCache.editUserVoiceState.file.default,
 editMFALevel: importCache.editMFALevel.file.default,
 getPreview: importCache.getPreview.file.default,
 create: importCache.create.file.default,
 createChannel: importCache.createChannel.file.default,
 setChannelPositions: importCache.setChannelPositions.file.default,
 getActiveThreads: importCache.getActiveThreads.file.default,
 getMemberBan: importCache.getMemberBan.file.default,
 banMember: importCache.banMember.file.default,
 banUser: importCache.banUser.file.default,
 unbanUser: importCache.unbanUser.file.default,
 setRolePositions: importCache.setRolePositions.file.default,
};

export default guilds;
