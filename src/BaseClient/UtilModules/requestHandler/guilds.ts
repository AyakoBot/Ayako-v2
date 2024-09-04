import edit from './guilds/edit.js';
import del from './guilds/delete.js';
import get from './guilds/get.js';
import getChannels from './guilds/getChannels.js';
import getWidgetImage from './guilds/getWidgetImage.js';
import getVanityURL from './guilds/getVanityURL.js';
import getWelcomeScreen from './guilds/getWelcomeScreen.js';
import editWelcomeScreen from './guilds/editWelcomeScreen.js';
import getWidgetSettings from './guilds/getWidgetSettings.js';
import editWidgetSettings from './guilds/editWidgetSettings.js';
import getWidget from './guilds/getWidget.js';
import getInvites from './guilds/getInvites.js';
import getIntegrations from './guilds/getIntegrations.js';
import deleteIntegration from './guilds/deleteIntegration.js';
import getVoiceRegions from './guilds/getVoiceRegions.js';
import beginPrune from './guilds/beginPrune.js';
import getAuditLogs from './guilds/getAuditLogs.js';
import getAutoModerationRules from './guilds/getAutoModerationRules.js';
import getAutoModerationRule from './guilds/getAutoModerationRule.js';
import createAutoModerationRule from './guilds/createAutoModerationRule.js';
import editAutoModerationRule from './guilds/editAutoModerationRule.js';
import deleteAutoModerationRule from './guilds/deleteAutoModerationRule.js';
import getEmojis from './guilds/getEmojis.js';
import getEmoji from './guilds/getEmoji.js';
import createEmoji from './guilds/createEmoji.js';
import editEmoji from './guilds/editEmoji.js';
import deleteEmoji from './guilds/deleteEmoji.js';
import getMembers from './guilds/getMembers.js';
import getMember from './guilds/getMember.js';
import searchForMembers from './guilds/searchForMembers.js';
import editMember from './guilds/editMember.js';
import removeMember from './guilds/removeMember.js';
import addRoleToMember from './guilds/addRoleToMember.js';
import removeRoleFromMember from './guilds/removeRoleFromMember.js';
import getRoles from './guilds/getRoles.js';
import createRole from './guilds/createRole.js';
import editRole from './guilds/editRole.js';
import deleteRole from './guilds/deleteRole.js';
import getPruneCount from './guilds/getPruneCount.js';
import deleteScheduledEvent from './guilds/deleteScheduledEvent.js';
import editScheduledEvent from './guilds/editScheduledEvent.js';
import createScheduledEvent from './guilds/createScheduledEvent.js';
import getScheduledEvent from './guilds/getScheduledEvent.js';
import getScheduledEvents from './guilds/getScheduledEvents.js';
import getScheduledEventUsers from './guilds/getScheduledEventUsers.js';
import getStickers from './guilds/getStickers.js';
import getSticker from './guilds/getSticker.js';
import createSticker from './guilds/createSticker.js';
import editSticker from './guilds/editSticker.js';
import deleteSticker from './guilds/deleteSticker.js';
import getTemplates from './guilds/getTemplates.js';
import getTemplate from './guilds/getTemplate.js';
import createTemplate from './guilds/createTemplate.js';
import editTemplate from './guilds/editTemplate.js';
import deleteTemplate from './guilds/deleteTemplate.js';
import getWebhooks from './guilds/getWebhooks.js';
import getMemberBans from './guilds/getMemberBans.js';
import getOnboarding from './guilds/getOnboarding.js';
import setVoiceState from './guilds/setVoiceState.js';
import syncTemplate from './guilds/syncTemplate.js';
import editUserVoiceState from './guilds/editUserVoiceState.js';
import editMFALevel from './guilds/editMFALevel.js';
import getPreview from './guilds/getPreview.js';
import create from './guilds/create.js';
import createChannel from './guilds/createChannel.js';
import setChannelPositions from './guilds/setChannelPositions.js';
import getActiveThreads from './guilds/getActiveThreads.js';
import getMemberBan from './guilds/getMemberBan.js';
import banUser from './guilds/banUser.js';
import banMember from './guilds/banMember.js';
import unbanUser from './guilds/unbanUser.js';
import setRolePositions from './guilds/setRolePositions.js';

interface Guilds {
 edit: typeof edit;
 delete: typeof del;
 get: typeof get;
 getChannels: typeof getChannels;
 getWidgetImage: typeof getWidgetImage;
 getVanityURL: typeof getVanityURL;
 getWelcomeScreen: typeof getWelcomeScreen;
 editWelcomeScreen: typeof editWelcomeScreen;
 getWidgetSettings: typeof getWidgetSettings;
 editWidgetSettings: typeof editWidgetSettings;
 getWidget: typeof getWidget;
 getInvites: typeof getInvites;
 getIntegrations: typeof getIntegrations;
 deleteIntegration: typeof deleteIntegration;
 getVoiceRegions: typeof getVoiceRegions;
 beginPrune: typeof beginPrune;
 getAuditLogs: typeof getAuditLogs;
 getAutoModerationRules: typeof getAutoModerationRules;
 getAutoModerationRule: typeof getAutoModerationRule;
 createAutoModerationRule: typeof createAutoModerationRule;
 editAutoModerationRule: typeof editAutoModerationRule;
 deleteAutoModerationRule: typeof deleteAutoModerationRule;
 getEmojis: typeof getEmojis;
 getEmoji: typeof getEmoji;
 createEmoji: typeof createEmoji;
 editEmoji: typeof editEmoji;
 deleteEmoji: typeof deleteEmoji;
 getMembers: typeof getMembers;
 getMember: typeof getMember;
 searchForMembers: typeof searchForMembers;
 editMember: typeof editMember;
 removeMember: typeof removeMember;
 addRoleToMember: typeof addRoleToMember;
 removeRoleFromMember: typeof removeRoleFromMember;
 getRoles: typeof getRoles;
 createRole: typeof createRole;
 editRole: typeof editRole;
 deleteRole: typeof deleteRole;
 getPruneCount: typeof getPruneCount;
 deleteScheduledEvent: typeof deleteScheduledEvent;
 editScheduledEvent: typeof editScheduledEvent;
 createScheduledEvent: typeof createScheduledEvent;
 getScheduledEvent: typeof getScheduledEvent;
 getScheduledEvents: typeof getScheduledEvents;
 getScheduledEventUsers: typeof getScheduledEventUsers;
 getStickers: typeof getStickers;
 getSticker: typeof getSticker;
 createSticker: typeof createSticker;
 editSticker: typeof editSticker;
 deleteSticker: typeof deleteSticker;
 getTemplates: typeof getTemplates;
 getTemplate: typeof getTemplate;
 createTemplate: typeof createTemplate;
 editTemplate: typeof editTemplate;
 deleteTemplate: typeof deleteTemplate;
 getWebhooks: typeof getWebhooks;
 getMemberBans: typeof getMemberBans;
 getOnboarding: typeof getOnboarding;
 setVoiceState: typeof setVoiceState;
 syncTemplate: typeof syncTemplate;
 editUserVoiceState: typeof editUserVoiceState;
 editMFALevel: typeof editMFALevel;
 getPreview: typeof getPreview;
 create: typeof create;
 createChannel: typeof createChannel;
 setChannelPositions: typeof setChannelPositions;
 getActiveThreads: typeof getActiveThreads;
 getMemberBan: typeof getMemberBan;
 banMember: typeof banMember;
 banUser: typeof banUser;
 unbanUser: typeof unbanUser;
 setRolePositions: typeof setRolePositions;
}

/**
 * This module contains methods for interacting with guilds in Discord.
 * @property {Function} edit
 * - Edits a guild.
 * @property {Function} delete
 * - Deletes a guild.
 * @property {Function} get
 * - Gets a guild.
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
 edit,
 delete: del,
 get,
 getChannels,
 getWidgetImage,
 getVanityURL,
 getWelcomeScreen,
 editWelcomeScreen,
 getWidgetSettings,
 editWidgetSettings,
 getWidget,
 getInvites,
 getIntegrations,
 deleteIntegration,
 getVoiceRegions,
 beginPrune,
 getAuditLogs,
 getAutoModerationRules,
 getAutoModerationRule,
 createAutoModerationRule,
 editAutoModerationRule,
 deleteAutoModerationRule,
 getEmojis,
 getEmoji,
 createEmoji,
 editEmoji,
 deleteEmoji,
 getMembers,
 getMember,
 searchForMembers,
 editMember,
 removeMember,
 addRoleToMember,
 removeRoleFromMember,
 getRoles,
 createRole,
 editRole,
 deleteRole,
 getPruneCount,
 deleteScheduledEvent,
 editScheduledEvent,
 createScheduledEvent,
 getScheduledEvent,
 getScheduledEvents,
 getScheduledEventUsers,
 getStickers,
 getSticker,
 createSticker,
 editSticker,
 deleteSticker,
 getTemplates,
 getTemplate,
 createTemplate,
 editTemplate,
 deleteTemplate,
 getWebhooks,
 getMemberBans,
 getOnboarding,
 setVoiceState,
 syncTemplate,
 editUserVoiceState,
 editMFALevel,
 getPreview,
 create,
 createChannel,
 setChannelPositions,
 getActiveThreads,
 getMemberBan,
 banMember,
 banUser,
 unbanUser,
 setRolePositions,
};

export default guilds;
