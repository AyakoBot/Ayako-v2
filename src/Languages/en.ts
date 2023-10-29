import * as Discord from 'discord.js';
import { Prisma } from '@prisma/client';
import type CT from '../Typings/CustomTypings.js';
import * as ch from '../BaseClient/ClientHelper.js';
import client from '../BaseClient/Client.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import packageJSON from '../../package.json' assert { type: 'json' };

type Strumber = string | number;

const name = client.user?.username ?? 'Ayako';

const time = {
 milliseconds: 'Millisecond(s)',
 seconds: 'Second(s)',
 minutes: 'Minute(s)',
 hours: 'Hour(s)',
 days: 'Day(s)',
 weeks: 'Week(s)',
 months: 'Month(s)',
 years: 'Year(s)',
 timeAgo: (t: string) => `${t} ago`,
 timeIn: (t: string) => `in ${t}`,
};

const linkedid = {
 name: 'Linked ID',
 desc: 'The linked Setting',
};

const none = 'none';
const None = 'None';
const Unknown = 'Unknown';
const unknown = 'unknown';

const multiplier = {
 name: 'XP Multiplier',
 desc: 'Multiplier to multiply the awarded XP per Message with',
};

const holdhands = {
 self: "holds their own hand, try holding someone else's next time",
 others: 'holds hands with',
 request: 'wants to hold your hand!',
 buttons: ['Hold Hands~!'],
};

const punishmentDuration = {
 name: 'Duration',
 desc: 'The Duration of the Punishment',
};

const punishmentAction = {
 name: 'Action',
 desc: 'The Action to take',
};

const punishmentDeleteMessageSeconds = {
 name: 'Delete Messages Time-Span',
 desc: 'Time-Span of Messages to Delete (Max. 7 Days)',
};

const getForumTag = (tag: Discord.GuildForumTag, emoji?: Discord.Emoji | string) =>
 `${emoji ? `${emoji} ` : ''}\`${tag.name}\` / \`${tag.id}\`${
  tag.moderated
   ? ` / ${ch.constants.standard.getEmote(ch.emotes.userFlags.DiscordEmployee)} Managed`
   : ''
 }`;

const getUser = (
 user: Discord.User | { bot: boolean; id: string; username: string; discriminator: string },
) =>
 `${user?.bot ? 'Bot' : 'User'} <@${user?.id}> / \`${
  user ? ch.constants.standard.user(user) : Unknown
 }\` / \`${user?.id}\`\n`;

const getAutoModerationRule = (rule: Discord.AutoModerationRule) =>
 `Auto-Moderation Rule \`${rule.name}\` / \`${rule.id}\`\n`;

const getMessage = (msg: Discord.Message | Discord.MessageReference) =>
 `[This Message](${ch.constants.standard.msgurl(
  msg.guildId,
  msg.channelId,
  'id' in msg ? msg.id : msg.messageId ?? '',
 )})\n`;

const getChannel = (
 channel:
  | Discord.Channel
  | Discord.GuildChannel
  | Discord.ThreadChannel
  | Discord.APIPartialChannel
  | { id: string; name: string }
  | undefined
  | null,
 type?: string,
) =>
 channel
  ? `${type ?? 'Channel'} <#${channel.id}> / ${
     'name' in channel
      ? `\`${channel.name}\``
      : `<@${'recipientId' in channel ? channel.recipientId : null}>`
    } / \`${channel.id}\`\n`
  : `Unknown Channel\n`;

const getEmote = (emoji: Discord.Emoji) =>
 `Emoji ${ch.constants.standard.getEmote(emoji)} / \`${emoji.name ?? None}\` / \`${
  emoji.id ?? None
 }\`\n`;

const getInviteDetails = (invite: Discord.Invite, user?: Discord.User, channelType?: string) =>
 `Code: \`${invite.code}\`\n${user ? `Inviter: ${getUser(user)}` : ''}Uses: ${
  invite.uses
 }\nCreated: ${
  invite.createdAt ? ch.constants.standard.getTime(invite.createdAt.getTime()) : 'unknown'
 }\n${getChannel(invite.channel, channelType)}`;

const getInvite = (invite: Discord.Invite) =>
 `Invite https://discord.gg/${invite.code} / \`${invite.code}\`\n`;

const getIntegration = (integration: Discord.Integration) =>
 `Integration \`${integration.name}\` / \`${integration.id}\`\n`;

const getRole = (role: Discord.Role | { id: string; name: string }) =>
 `Role <@&${role.id}> / \`${role.name}\` / \`${role.id}\`\n`;

const getApplication = (
 application: Discord.Application | Discord.IntegrationApplication | bigint,
) =>
 `Application ${
  typeof application === 'bigint'
   ? `<@${application}> / \`${application}\``
   : `<@${application.id}> / \`${application.name}\` / \`${application.id}\`\n`
 }`;

const getScheduledEvent = (event: Discord.GuildScheduledEvent) =>
 `Scheduled Event \`${event.name}\` / \`${event.id}\`\n`;

const getWebhook = (webhook: Discord.Webhook, type?: string) =>
 `${type ? `${type} ` : ''}Webhook \`${webhook.name}\` / \`${webhook.id}\`\n`;

const getGuild = (guild: Discord.Guild | Discord.APIPartialGuild | Discord.InviteGuild) =>
 `Server \`${guild.name}\` / \`${guild.id}\`${
  'vanityURLCode' in guild && guild.vanityURLCode
   ? ` / [Join](https://discord.gg/${guild.vanityURLCode})`
   : ''
 }\n`;

const getCommand = (command: Discord.ApplicationCommand) =>
 `Command </${command.name}:${command.id}> / \`${command.name}\` / \`${command.id}\`\n`;

const getSticker = (sticker: Discord.Sticker) =>
 `Sticker \`${sticker.name}\` / \`${sticker.id}\`\n`;

const getPunishment = (id: Prisma.Decimal) =>
 `Punishment \`${Number(id).toString(
  36,
 )}\`\nUse </check:1098291480772235325> to look this Punishment up`;

const getStageInstance = (stageInstance: Discord.StageInstance) =>
 `Stage Instance \`${stageInstance.topic}\` / \`${stageInstance.id}\`\nin\n${getChannel(
  stageInstance.channel,
 )}`;

const auditLogAction: { [key in Discord.GuildAuditLogsEntry['action']]: string } = {
 1: 'Server Update',
 10: 'Channel Create',
 11: 'Channel Update',
 12: 'Channel Delete',
 13: 'Permission Overwrite Create',
 14: 'Permission Overwrite Update',
 15: 'Permission Overwrite Delete',
 20: 'Member Kick',
 21: 'Member Prune',
 22: 'Member Ban Add',
 23: 'Member Ban Remove',
 24: 'Member Update',
 25: 'Member Role Update',
 26: 'Member Move',
 27: 'Member Disconnect',
 28: 'Bot Add',
 30: 'Role Create',
 31: 'Role Update',
 32: 'Role Delete',
 40: 'Invite Create',
 41: 'Invite Update',
 42: 'Invite Delete',
 50: 'Webhook Create',
 51: 'Webhook Update',
 52: 'Webhook Delete',
 60: 'Emoji Create',
 61: 'Emoji Update',
 62: 'Emoji Delete',
 72: 'Message Delete',
 73: 'Message Bulk Delete',
 74: 'Message Pin',
 75: 'Message Unpin',
 80: 'Integration Create',
 81: 'Integration Update',
 82: 'Integration Delete',
 83: 'Stage Instance Create',
 84: 'Stage Instance Update',
 85: 'Stage Instance Delete',
 90: 'Sticker Create',
 91: 'Sticker Update',
 92: 'Sticker Delete',
 100: 'Scheduled Event Create',
 101: 'Scheduled Event Update',
 102: 'Scheduled Event Delete',
 110: 'Thread Create',
 111: 'Thread Update',
 112: 'Thread Delete',
 121: 'Application Command Permission Update',
 140: 'Auto Moderation Rule Create',
 141: 'Auto Moderation Rule Update',
 142: 'Auto Moderation Rule Delete',
 143: 'Auto Moderation Block Message',
 144: 'Auto Moderation Flag To Channel',
 145: 'Auto Moderation User Communication Disabled',
 150: 'Creator Monetization Request Created',
 151: 'Creator Monetization Terms Accepted',
};

const getAuditLog = (audit: Discord.GuildAuditLogsEntry) =>
 `Audit-Log \`${auditLogAction[audit.action]}\` / \`${audit.id}\`\n`;

export default {
 languageFunction: {
  getForumTag,
  getGuild,
  getChannel,
  getUser,
  getAutoModerationRule,
  getMessage,
  getEmote,
  getInvite,
  getInviteDetails,
  getIntegration,
  getRole,
  getApplication,
  getScheduledEvent,
  getWebhook,
  getCommand,
  getPunishment,
  getSticker,
  getStageInstance,
  getAuditLog,
 },
 events: {
  logs: {
   addedRemoved: (added: string, removed: string) =>
    `__**Added**__\n${added}\n\n__**Removed**__\n${removed}`,
   beforeAfter: (before: string, after: string) =>
    `__**Before**__\n${before}\n\n__**Now**__\n${after}`,
   sticker: {
    descCreateAudit: (sticker: Discord.Sticker, user: Discord.User) =>
     `${getUser(user)}has created\n${getSticker(sticker)}`,
    descCreate: (sticker: Discord.Sticker) => `${getSticker(sticker)}was created`,
    descDeleteAudit: (sticker: Discord.Sticker, user: Discord.User) =>
     `${getUser(user)}has deleted\n${getSticker(sticker)}`,
    descDelete: (sticker: Discord.Sticker) => `${getSticker(sticker)}was deleted`,
    descUpdateAudit: (sticker: Discord.Sticker, user: Discord.User) =>
     `${getUser(user)}has updated\n${getSticker(sticker)}`,
    descUpdate: (sticker: Discord.Sticker) => `${getSticker(sticker)}was updated`,
    nameCreate: 'Sticker created',
    nameDelete: 'Sticker deleted',
    nameUpdate: 'Sticker updated',
    description: 'Description',
    formatName: 'Format',
    format: {
     1: 'Image',
     2: 'Animated Image',
     3: 'Lottie File',
     4: 'GIF',
    },
    tags: 'Suggestions / Autocompletion for the Sticker',
   },
   application: {
    name: 'Application Command Permissions updated',
    descUpdateCommand: (
     application: Discord.User,
     user: Discord.User,
     command: Discord.ApplicationCommand,
    ) =>
     `${getUser(user)}has updated Permissions of\n${getCommand(command)}from\n${getUser(
      application,
     )}`,
    descUpdateAll: (application: Discord.User, user: Discord.User) =>
     `${getUser(user)}has updated Permissions of\nall Commands\nfrom\n${getUser(application)}`,
    permissionTypeName: 'Permission Type',
    allChannels: 'All Channels',
   },
   scheduledEvent: {
    descUserRemoveChannel: (
     user: Discord.User,
     event: Discord.GuildScheduledEvent,
     channel:
      | Discord.NewsChannel
      | Discord.TextChannel
      | Discord.PrivateThreadChannel
      | Discord.PublicThreadChannel<boolean>
      | Discord.VoiceBasedChannel,
     channelType: string,
    ) =>
     `${getUser(user)}has left\n${getScheduledEvent(event)}planned in\n${getChannel(
      channel,
      channelType,
     )}`,
    descUserRemove: (user: Discord.User, event: Discord.GuildScheduledEvent) =>
     `${getUser(user)}has left\n${getScheduledEvent(event)}`,
    descUserAddChannel: (
     user: Discord.User,
     event: Discord.GuildScheduledEvent,
     channel:
      | Discord.NewsChannel
      | Discord.TextChannel
      | Discord.PrivateThreadChannel
      | Discord.PublicThreadChannel<boolean>
      | Discord.VoiceBasedChannel,
     channelType: string,
    ) =>
     `${getUser(user)}has joined\n${getScheduledEvent(event)}planned in\n${getChannel(
      channel,
      channelType,
     )}`,
    descUserAdd: (user: Discord.User, event: Discord.GuildScheduledEvent) =>
     `${getUser(user)}has joined\n${getScheduledEvent(event)}`,
    descDeleteChannelAudit: (
     event: Discord.GuildScheduledEvent,
     user: Discord.User,
     channel:
      | Discord.NewsChannel
      | Discord.TextChannel
      | Discord.PrivateThreadChannel
      | Discord.PublicThreadChannel<boolean>
      | Discord.VoiceBasedChannel,
     channelType: string,
    ) =>
     `${getUser(user)}has deleted\n${getScheduledEvent(event)}from\n${getChannel(
      channel,
      channelType,
     )}`,
    descDeleteAudit: (event: Discord.GuildScheduledEvent, user: Discord.User) =>
     `${getUser(user)}has deleted\n${getScheduledEvent(event)}`,
    descDeleteChannel: (
     event: Discord.GuildScheduledEvent,
     channel:
      | Discord.NewsChannel
      | Discord.TextChannel
      | Discord.PrivateThreadChannel
      | Discord.PublicThreadChannel<boolean>
      | Discord.VoiceBasedChannel,
     channelType: string,
    ) => `${getScheduledEvent(event)}has deleted from\n${getChannel(channel, channelType)}`,
    descDelete: (event: Discord.GuildScheduledEvent) => `${getScheduledEvent(event)}was deleted`,
    descCreateChannelAudit: (
     event: Discord.GuildScheduledEvent,
     user: Discord.User,
     channel:
      | Discord.NewsChannel
      | Discord.TextChannel
      | Discord.PrivateThreadChannel
      | Discord.PublicThreadChannel<boolean>
      | Discord.VoiceBasedChannel,
     channelType: string,
    ) =>
     `${getUser(user)}has created\n${getScheduledEvent(event)}from\n${getChannel(
      channel,
      channelType,
     )}`,
    descCreateAudit: (event: Discord.GuildScheduledEvent, user: Discord.User) =>
     `${getUser(user)}has created\n${getScheduledEvent(event)}`,
    descCreateChannel: (
     event: Discord.GuildScheduledEvent,
     channel:
      | Discord.NewsChannel
      | Discord.TextChannel
      | Discord.PrivateThreadChannel
      | Discord.PublicThreadChannel<boolean>
      | Discord.VoiceBasedChannel,
     channelType: string,
    ) => `${getScheduledEvent(event)}has created from\n${getChannel(channel, channelType)}`,
    descCreate: (event: Discord.GuildScheduledEvent) => `${getScheduledEvent(event)}was created`,
    descUpdateChannelAudit: (
     event: Discord.GuildScheduledEvent,
     user: Discord.User,
     channel:
      | Discord.NewsChannel
      | Discord.TextChannel
      | Discord.PrivateThreadChannel
      | Discord.PublicThreadChannel<boolean>
      | Discord.VoiceBasedChannel,
     channelType: string,
    ) =>
     `${getUser(user)}has updated\n${getScheduledEvent(event)}from\n${getChannel(
      channel,
      channelType,
     )}`,
    descUpdateAudit: (event: Discord.GuildScheduledEvent, user: Discord.User) =>
     `${getUser(user)}has updated\n${getScheduledEvent(event)}`,
    descUpdateChannel: (
     event: Discord.GuildScheduledEvent,
     channel:
      | Discord.NewsChannel
      | Discord.TextChannel
      | Discord.PrivateThreadChannel
      | Discord.PublicThreadChannel<boolean>
      | Discord.VoiceBasedChannel,
     channelType: string,
    ) => `${getChannel(channel, channelType)} of \n${getScheduledEvent(event)}\nwas updated`,
    descUpdate: (event: Discord.GuildScheduledEvent) => `${getScheduledEvent(event)}was updated`,
    nameUserRemove: 'Scheduled Event Member removed',
    nameUserAdd: 'Scheduled Event Member added',
    nameDelete: 'Scheduled Event deleted',
    nameCreate: 'Scheduled Event created',
    nameUpdate: 'Scheduled Event updated',
    location: 'Location',
    scheduledStartTime: 'Scheduled Start Time',
    scheduledEndTime: 'Scheduled End Time',
    creator: 'Creator',
    statusName: 'Status',
    status: {
     1: 'Scheduled',
     2: 'Active',
     3: 'Completed',
     4: 'Canceled',
    },
    privacyLevelName: 'Privacy Level',
    privacyLevel: {
     1: 'Public',
     2: 'Server Only',
    },
    entityTypeName: 'Entity Type',
    entityType: {
     1: 'Stage Instance',
     2: 'Voice Channel',
     3: 'External',
    },
    participants: 'Participants',
    image: 'Image',
    imageRemoved: 'Image removed',
   },
   voiceState: {
    descCreate: (user: Discord.User, channel: Discord.GuildChannel, channelType: string) =>
     `${getUser(user)}has joined\n${getChannel(channel, channelType)}`,
    descUpdateChannel: (
     user: Discord.User,
     channel: Discord.GuildChannel,
     channelType: string,
     oldChannel: Discord.GuildChannel | undefined,
     oldChannelType: string | undefined,
    ) =>
     `${getUser(user)}has switched from\n${getChannel(
      oldChannel,
      oldChannelType,
     )}into\n${getChannel(channel, channelType)}`,
    descUpdate: (user: Discord.User, channel: Discord.VoiceBasedChannel, channelType: string) =>
     `The Voice State of\n${getUser(user)}in\n${getChannel(channel, channelType)}was updated`,
    descDelete: (user: Discord.User, channel: Discord.GuildChannel, channelType: string) =>
     `${getUser(user)}has left\n${getChannel(channel, channelType)}`,
    nameUpdate: 'Voice State updated',
    LockedVoiceJoin: 'Locked Voice Channel joined',
    LockedVoiceLeave: 'Locked Voice Channel left',
    LockedVoiceSwitch: 'Locked Voice Channel switched',
    StageJoin: 'Stage Channel joined',
    StageLeave: 'Stage Channel left',
    StageSwitch: 'Stage Channel switched',
    VoiceSwitch: 'Voice Channel switched',
    VoiceLeave: 'Voice Channel left',
    VoiceJoin: 'Voice Channel joined',
    requestToSpeak: 'Requests to speak',
    deaf: 'Server Deafened',
    mute: 'Server Muted',
    selfDeaf: 'Locally Deafened',
    selfMute: 'Locally Muted',
    selfStream: 'Streaming',
    selfVideo: 'Camera',
   },
   webhook: {
    descCreateAudit: (
     webhook: Discord.Webhook,
     webhookType: string,
     user: Discord.User,
     channel: Discord.GuildChannel,
     channelType: string,
    ) =>
     `${getUser(user)}has created\n${getWebhook(webhook, webhookType)}in\n${getChannel(
      channel,
      channelType,
     )}`,
    descCreate: (
     webhook: Discord.Webhook,
     webhookType: string,
     channel: Discord.GuildChannel,
     channelType: string,
    ) => `${getWebhook(webhook, webhookType)}was created in\n${getChannel(channel, channelType)}`,
    descDeleteAudit: (
     webhook: Discord.Webhook,
     webhookType: string,
     user: Discord.User,
     channel: Discord.GuildChannel,
     channelType: string,
    ) =>
     `${getUser(user)}has deleted\n${getWebhook(webhook, webhookType)}in\n${getChannel(
      channel,
      channelType,
     )}`,
    descDelete: (
     webhook: Discord.Webhook,
     webhookType: string,
     channel: Discord.GuildChannel,
     channelType: string,
    ) => `${getWebhook(webhook, webhookType)}in\n${getChannel(channel, channelType)}was deleted`,
    descUpdateAudit: (
     webhook: Discord.Webhook,
     webhookType: string,
     user: Discord.User,
     channel: Discord.GuildChannel,
     channelType: string,
    ) =>
     `${getUser(user)}has updated\n${getWebhook(webhook, webhookType)}in\n${getChannel(
      channel,
      channelType,
     )}`,
    descUpdate: (
     webhook: Discord.Webhook,
     webhookType: string,
     channel: Discord.GuildChannel,
     channelType: string,
    ) => `${getWebhook(webhook, webhookType)} in\n${getChannel(channel, channelType)}updated`,
    nameCreate: 'Webhook created',
    nameUpdate: 'Webhook updated',
    nameDelete: 'Webhook deleted',
    sourceGuild: 'Source Server',
    sourceChannel: 'Source Channel',
    avatar: 'Avatar',
    avatarRemoved: 'Avatar Removed',
    webhookTypes: {
     1: 'Incoming',
     2: 'Channel Follow',
     3: 'Application',
    },
   },
   role: {
    descCreateAudit: (user: Discord.User, role: Discord.Role) =>
     `${getUser(user)}has created\n${getRole(role)}`,
    descCreate: (role: Discord.Role) => `${getRole(role)}was created`,
    descDeleteAudit: (user: Discord.User, role: Discord.Role) =>
     `${getUser(user)}has deleted\n${getRole(role)}`,
    descDelete: (role: Discord.Role) => `${getRole(role)}was deleted`,
    descUpdateAudit: (role: Discord.Role, user: Discord.User) =>
     `${getUser(user)}has updated\n${getRole(role)}`,
    descUpdate: (role: Discord.Role) => `${getRole(role)}was updated`,
    nameCreate: 'Role created',
    nameDelete: 'Role deleted',
    nameUpdate: 'Role updated',
    managed: 'Managed by a Bot/Integration',
    hoisted: 'Hoisted',
    mentionable: 'Mentionable',
    boosterRole: 'Booster Role',
    unicodeEmoji: 'Unicode Emoji',
    icon: 'Icon',
    iconRemoved: 'Icon Removed',
    subscriptionListingId: 'Subscription Listing ID',
    availableForPurchase: 'Available for Purchase',
    guildConnections: 'Requires Connection',
    inOnboarding: 'In Onboarding',
   },
   reaction: {
    descAdded: (emoji: Discord.Emoji, user: Discord.User, msg: Discord.Message) =>
     `${getUser(user)}has reacted with\n${getEmote(emoji)}to\n${getMessage(msg)}`,
    descRemoved: (emoji: Discord.Emoji, user: Discord.User, msg: Discord.Message) =>
     `Reaction on\n${getMessage(msg)}with ${getEmote(emoji)}by ${getUser(
      user,
     )}was removed.\nEither by the Reactor themselves or by a Moderator`,
    descRemovedAll: (msg: Discord.Message) => `All Reactions on\n${getMessage(msg)}were removed`,
    descRemoveEmoji: (msg: Discord.Message, emoji: Discord.Emoji) =>
     `Reaction with\n${getEmote(emoji)}was removed from\n${getMessage(msg)}`,
    nameRemoveAll: 'All Reactions removed',
    nameAdd: 'Reaction added',
    nameRemove: 'Reaction removed',
    nameRemoveEmoji: 'Emoji Reaction removed',
    reactions: 'Reactions',
    count: 'Reaction count',
   },
   message: {
    nameDelete: 'Message Deleted',
    nameUpdate: 'Message Updated',
    descDeleteAudit: (user: Discord.User, msg: Discord.Message) =>
     `${getUser(user)}has deleted\n${getMessage(msg)}from\n${getUser(msg.author)}`,
    descDelete: (msg: Discord.Message) =>
     `${getMessage(msg)}from\n${getUser(msg.author)}was deleted`,
    descDeleteBulkAudit: (
     user: Discord.User,
     size: number,
     channel: Discord.GuildTextBasedChannel,
    ) => `${getUser(user)}has bulk deleted\n${size} Messages in\n${getChannel(channel)}`,
    descDeleteBulk: (size: number, channel: Discord.GuildTextBasedChannel) =>
     `${size} Messages were deleted in\n${getChannel(channel)}`,
    descUpdateMaybe: (msg: Discord.Message) =>
     `${getMessage(msg)}may have been updated by\n${getUser(msg.author)}or by a Moderator`,
    descUpdate: (msg: Discord.Message) => `${getMessage(msg)}was updated`,
    descUpdateAuthor: (msg: Discord.Message) =>
     `${getMessage(msg)} was updated by\n${getUser(msg.author)}`,
    flags: {
     Crossposted: 'Published',
     IsCrosspost: 'Received from a News Channel',
     Loading: 'Loading',
     SuppressEmbeds: 'Suppressed Embeds',
     SourceMessageDeleted: 'Source Message Deleted',
     Urgent: 'Message from Discord System',
     HasThread: 'Message has Thread',
     Ephemeral: 'Ephemeral Message',
     FailedToMentionSomeRolesInThread: 'Failed to mention some Roles in Thread',
     SuppressNotifications: 'Supress Notifications',
     IsVoiceMessage: 'Voice Message',
     ShouldShowLinkNotDiscordWarning: 'Should Show Link not Discord Warning',
    },
    reactions: 'Reactions',
    components: 'Components',
    edited: 'Edited',
    activityName: 'Activity',
    activity: {
     1: 'Join',
     2: 'Spectate',
     3: 'Listen',
     5: 'Join Request',
    },
    interactionName: 'Interaction',
    interaction: {
     1: 'Ping',
     2: 'Applicaiton Command',
     3: 'Message Component',
     4: 'Application Command Autocomplete',
     5: 'Modal Submit',
    },
    stickers: 'Stickers',
    referenceMessage: 'Replied Message',
    type: {
     0: 'Default',
     1: 'Recipient Add',
     2: 'Recipient Remove',
     3: 'Call',
     4: 'Channel Name Change',
     5: 'Channel Iconm Change',
     6: 'Pinned Message',
     7: 'User Join',
     8: 'Boost',
     9: 'Boost Tier 1',
     10: 'Boost Tier 2',
     11: 'Boost Tier 3',
     12: 'Channel Follow Add',
     14: 'Guild Discovery Disqualified',
     15: 'Guild Discovery Requalified',
     16: 'Guild Discovery Grace Period Inicial Warning',
     17: 'Guild Discovery Grace Period Final Warning',
     18: 'Thread Created',
     19: 'Reply',
     20: 'Chat Input Command',
     21: 'Thread Starter Message',
     22: 'Guild Invite Reminder',
     23: 'Context Menu Command',
     24: 'Auto Moderation Action',
     25: 'Role Subscription Purchase',
     26: 'Interactiopn Premium Upsell',
     27: 'Stage Start',
     28: 'Stage End',
     29: 'Stage Speaker',
     30: 'Stage Raise Hand',
     31: 'Stage Topic',
     32: 'Guild Application Premium Subscription',
    },
    embeds: 'Embeds',
    isFromBot: 'From Bot',
    tts: 'Text to Speech',
    mentionEveryone: 'Mentions Everyone',
    pinned: 'Pinned',
    mentionedUsers: 'Mentioned Users',
    mentionedRoles: 'Mentioned Roles',
    mentionedChannels: 'Mentioned Channels',
    editedTimestamp: 'Last edited',
    beforeContent: '__Content before__:',
    afterContent: '__Content after__:',
    isRemix: 'Is Remix',
   },
   invite: {
    descCreateAudit: (user: Discord.User, invite: Discord.Invite) =>
     `${getUser(user)}has created\n${getInvite(invite)}`,
    descCreate: (invite: Discord.Invite) => `${getInvite(invite)}was created`,
    descDeleteAudit: (user: Discord.User, invite: Discord.Invite) =>
     `${getUser(user)}has deleted\n${getInvite(invite)}`,
    descDelete: (invite: Discord.Invite) => `${getInvite(invite)}was deleted`,
    nameCreate: 'Invite created',
    nameDelete: 'Invite deleted',
    inviter: 'Inviter',
    targetUser: 'Target User',
    flagsName: 'Flags',
    temporary: 'Temporary',
    targetTypeName: 'Target Type',
    targetType: {
     1: 'Stream',
     2: 'Embedded Application',
    },
    maxAge: 'Max. Age',
    maxUses: 'Max. Uses',
    expiresAt: 'Expires at',
   },
   integration: {
    descCreateAudit: (integration: Discord.Integration, user: Discord.User) =>
     `${getUser(user)}has created\n${getIntegration(integration)}`,
    descCreate: (integration: Discord.Integration) => `${getIntegration(integration)}was created`,
    descDeleteIntegrationAudit: (
     user: Discord.User,
     integration: Discord.Integration,
     application: Discord.Application,
    ) =>
     `${getUser(user)}has deleted\n${getIntegration(integration)}from${getApplication(
      application,
     )}`,
    descDeleteAudit: (user: Discord.User, integration: Discord.Integration) =>
     `${getUser(user)}has deleted\n${getIntegration(integration)}`,
    descDeleteIntegration: (integration: Discord.Integration) =>
     `${getIntegration(integration)}was deleted`,
    descUpdateAudit: (user: Discord.User, integration: Discord.Integration) =>
     `${getUser(user)}has updated\n${getIntegration(integration)}`,
    descUpdate: (integration: Discord.Integration) => `${getIntegration(integration)}was updated`,
    nameCreate: 'Integration created',
    nameDelete: 'Integration deleted',
    nameUpdate: 'Integration updated',
    flagsName: 'Flags',
    syncing: 'Syncing',
    enableEmoticons: 'Enables Emotes',
    revoked: 'Revoked',
    expireBehaviorName: 'Expire Behaviour',
    expireBehavior: {
     0: 'Remove Role from Member',
     1: 'Kick Member',
    },
    expireGracePeriod: 'Expire Grace Period',
    syncedAt: 'Synced At',
    subscriberCount: 'Subscribers Count',
    account: 'Account',
    getAccount: (account: Discord.IntegrationAccount) =>
     `Account \`${account.name}\` / \`${account.id}\``,
   },
   guild: {
    descBan: (user: Discord.User) => `${getUser(user)}was banned`,
    descBanAudit: (user: Discord.User, executor: Discord.User) =>
     `${getUser(executor)}has banned\n${getUser(user)}`,
    descUnban: (user: Discord.User) => `${getUser(user)} was un-banned`,
    descUnbanAudit: (user: Discord.User, executor: Discord.User) =>
     `${getUser(executor)}has un-banned\n${getUser(user)}`,
    descEmojiCreateAudit: (user: Discord.User, emoji: Discord.Emoji) =>
     `${getUser(user)}has created\n${getEmote(emoji)}`,
    descEmojiCreate: (emoji: Discord.Emoji) => `${getEmote(emoji)}was created`,
    descEmojiDeleteAudit: (user: Discord.User, emoji: Discord.Emoji) =>
     `${getUser(user)}has deleted\n${getEmote(emoji)}`,
    descEmojiDelete: (emoji: Discord.Emoji) => `${getEmote(emoji)}was deleted`,
    descEmojiUpdateAudit: (user: Discord.User, emoji: Discord.Emoji) =>
     `${getUser(user)}has updated\n${getEmote(emoji)}`,
    descEmojiUpdate: (emoji: Discord.Emoji) => `${getEmote(emoji)}was updated`,
    descJoinAudit: (user: Discord.User, executor: Discord.User) =>
     `${getUser(executor)}has added\n${getUser(user)}`,
    descMemberJoin: (user: Discord.User) => `${getUser(user)}has joined`,
    descBotJoin: (user: Discord.User) => `${getUser(user)}was added`,
    descBotLeave: (user: Discord.User) => `${getUser(user)}has left the Server`,
    descBotLeaveAudit: (user: Discord.User, executor: Discord.User) =>
     `${getUser(executor)}has kicked\n${getUser(user)}`,
    descMemberLeave: (user: Discord.User) => `${getUser(user)}has left the Server`,
    descMemberLeaveAudit: (user: Discord.User, executor: Discord.User) =>
     `${getUser(executor)}has kicked\n${getUser(user)}`,
    descBotUpdate: (user: Discord.User) => `${getUser(user)}was updated`,
    descBotUpdateAudit: (user: Discord.User, executor: Discord.User) =>
     `${getUser(executor)}has updated\n${getUser(user)}`,
    descMemberUpdate: (user: Discord.User) => `${getUser(user)}was updated`,
    descMemberUpdateAudit: (user: Discord.User, executor: Discord.User) =>
     `${getUser(executor)}has updated\n${getUser(user)}`,
    descGuildUpdate: () => `The Server was updated`,
    descGuildUpdateAudit: (executor: Discord.User) => `${getUser(executor)}has updated the Server`,
    descAuditLogCreate: (audit: Discord.GuildAuditLogsEntry) =>
     `New \n${getAuditLog(audit)} created ${
      audit.executor ? `by\n${getUser(audit.executor)}` : ''
     }`,
    descAuditLogCreateGuild: (audit: Discord.GuildAuditLogsEntry, guild: Discord.Guild) =>
     `New \n${getAuditLog(audit)} created ${
      audit.executor ? `by\n${getUser(audit.executor)}` : ''
     }for\n${getGuild(guild)}`,
    descAuditLogCreateChannel: (
     audit: Discord.GuildAuditLogsEntry,
     channel: Discord.GuildChannel,
    ) =>
     `New \n${getAuditLog(audit)} created ${
      audit.executor ? `by\n${getUser(audit.executor)}` : ''
     }for\n${getChannel(channel)}`,
    descAuditLogCreateUser: (audit: Discord.GuildAuditLogsEntry, user: Discord.User) =>
     `New \n${getAuditLog(audit)} created ${
      audit.executor ? `by\n${getUser(audit.executor)}` : ''
     }for\n${getUser(user)}`,
    descAuditLogCreateRole: (
     audit: Discord.GuildAuditLogsEntry,
     role: Discord.Role | { id: string; name: string },
    ) =>
     `New \n${getAuditLog(audit)} created ${
      audit.executor ? `by\n${getUser(audit.executor)}` : ''
     }for\n${getRole(role)}`,
    descAuditLogCreateInvite: (audit: Discord.GuildAuditLogsEntry, invite: Discord.Invite) =>
     `New \n${getAuditLog(audit)} created ${
      audit.executor ? `by\n${getUser(audit.executor)}` : ''
     }for\n${getInvite(invite)}`,
    descAuditLogCreateWebhook: (audit: Discord.GuildAuditLogsEntry, webhook: Discord.Webhook) =>
     `New \n${getAuditLog(audit)} created ${
      audit.executor ? `by\n${getUser(audit.executor)}` : ''
     }for\n${getWebhook(webhook)}`,
    descAuditLogCreateEmoji: (audit: Discord.GuildAuditLogsEntry, emoji: Discord.Emoji) =>
     `New \n${getAuditLog(audit)} created ${
      audit.executor ? `by\n${getUser(audit.executor)}` : ''
     }for\n${getEmote(emoji)}`,
    descAuditLogCreateMessage: (audit: Discord.GuildAuditLogsEntry, message: Discord.Message) =>
     `New \n${getAuditLog(audit)} created ${
      audit.executor ? `by\n${getUser(audit.executor)}` : ''
     }for\n${getMessage(message)}`,
    descAuditLogCreateIntegration: (
     audit: Discord.GuildAuditLogsEntry,
     integration: Discord.Integration,
    ) =>
     `New \n${getAuditLog(audit)} created ${
      audit.executor ? `by\n${getUser(audit.executor)}` : ''
     }for\n${getIntegration(integration)}`,
    descAuditLogCreateStageInstance: (
     audit: Discord.GuildAuditLogsEntry,
     stageInstance: Discord.StageInstance,
    ) =>
     `New \n${getAuditLog(audit)} created ${
      audit.executor ? `by\n${getUser(audit.executor)}` : ''
     }for\n${getStageInstance(stageInstance)}`,
    descAuditLogCreateSticker: (audit: Discord.GuildAuditLogsEntry, sticker: Discord.Sticker) =>
     `New \n${getAuditLog(audit)} created ${
      audit.executor ? `by\n${getUser(audit.executor)}` : ''
     }for\n${getSticker(sticker)}`,
    descAuditLogCreateThread: (audit: Discord.GuildAuditLogsEntry, thread: Discord.ThreadChannel) =>
     `New \n${getAuditLog(audit)} created ${
      audit.executor ? `by\n${getUser(audit.executor)}` : ''
     }for\n${getChannel(thread)}`,
    descAuditLogCreateGuildScheduledEvent: (
     audit: Discord.GuildAuditLogsEntry,
     scheduledEvent: Discord.GuildScheduledEvent,
    ) =>
     `New \n${getAuditLog(audit)} created ${
      audit.executor ? `by\n${getUser(audit.executor)}` : ''
     }for\n${getScheduledEvent(scheduledEvent)}`,
    descAuditLogCreateApplicationCommand: (
     audit: Discord.GuildAuditLogsEntry,
     applicationCommand: Discord.ApplicationCommand,
    ) =>
     `New ${getAuditLog(audit)} created ${
      audit.executor ? `by\n${getUser(audit.executor)}` : ''
     }for\n${getCommand(applicationCommand)}`,
    descAuditLogCreateAutoModerationRule: (
     audit: Discord.GuildAuditLogsEntry,
     autoModerationRule: Discord.AutoModerationRule,
    ) =>
     `New \n${getAuditLog(audit)} created ${
      audit.executor ? `by\n${getUser(audit.executor)}` : ''
     }for\n${getAutoModerationRule(autoModerationRule)}`,
    descAuditLogCreateAutoModeration: (
     audit: Discord.GuildAuditLogsEntry,
     member: Discord.GuildMember,
     rule: Discord.AutoModerationRule,
    ) =>
     `New \n${getAuditLog(audit)} created by\n${getAutoModerationRule(rule)}for\n${getUser(
      member.user,
     )}`,
    descMemberPrune: (executor: Discord.User, amount: number, days: number) =>
     `${getUser(executor)}pruned \`${amount}\` Members\nfor \`${days}\` Days of inactivity`,
    auditLogChangeKeys: {
     $add: 'Added',
     $remove: 'Removed',
     nick: 'Nickname',
     name: 'Name',
     permissions: 'Permissions',
     color: 'Color',
     mentionable: 'Mentionable',
     hoist: 'Hoisted',
     icon_hash: 'Icon',
     mute: 'Server Muted',
     deaf: 'Server Deafened',
     communication_disabled_until: 'Timed out until',
     unicode_emoji: 'Unicode Emoji',
     tags: 'Related Emoji',
     description: 'Description',
     vanity_url_code: 'Vanity URL Code',
     position: 'Position',
     topic: 'Topic',
     code: 'Code',
     application_id: 'Application',
     max_uses: 'Max. Uses',
     uses: 'Uses',
     id: 'ID',
     user_limit: 'User Limit',
     location: 'Location',
     bitrate: 'Bitrate',
     permission_overwrites: 'Permission Overwrites',
     allow: 'Allowed',
     deny: 'Denied',
     archived: 'Archived',
     widget_enabled: 'Widget Enabled',
     temporary: 'Temporary',
     nsfw: 'NSFW',
     locked: 'Locked',
     enable_emoticons: 'Emoticons Enabled',
     available: 'Available',
     enabled: 'Enabled',
     image_hash: 'Image',
     avatar_hash: 'Avatar',
     type: 'Type',
     owner_id: 'Owner',
     inviter_id: 'Inviter',
     region: 'Region',
     preferred_locale: 'Preferred Locale',
     afk_channel_id: 'AFK Channel',
     rules_channel_id: 'Rules Channel',
     public_updates_channel_id: 'Public Updates Channel',
     widget_channel_id: 'Widget Channel',
     safety_alserts_channel_id: 'Safety Alerts Channel',
     system_channel_id: 'System Channel',
     channel_id: 'Channel',
     mfa_level: 'MFA Level',
     verification_level: 'Verification Level',
     explicit_content_filter: 'Explicit Content Filter',
     default_message_notifications: 'Default Message Notifications',
     prune_delete_days: 'Prune Delete Days',
     afk_timeout: 'AFK Timeout',
     rate_limit_per_user: 'Slowmode',
     max_age: 'Max. Age',
     auto_archive_duration: 'Auto Archive Duration',
     default_auto_archive_duration: 'Default Auto Archive Duration',
     expire_grace_period: 'Expire Grace Period',
     exempt_roles: 'Exempt Roles',
     exempt_channels: 'Exempt Channels',
     expire_behavior: 'Expire Behavior',
     privacy_level: 'Privacy Level',
     entity_type: 'Entity Type',
     status: 'Status',
     trigger_type: 'Trigger Type',
     event_type: 'Event Type',
     format_type: 'Format Type',
     trigger_metadata: 'Trigger Metadata',
     actions: 'Actions',
    },
    memberPrune: 'Members Pruned',
    changes: 'Changes',
    memberJoin: 'Member joined',
    botJoin: 'Bot joined',
    ban: 'User banned',
    unban: 'User un-banned',
    auditCreate: 'Audit-Log created',
    emojiCreate: 'Emoji created',
    emojiDelete: 'Emoji deleted',
    emojiUpdate: 'Emoji updated',
    invite: 'Invite',
    discovery: 'Joined through Server Discovery, an Emote, or a Sticker',
    botKick: 'Bot kicked',
    memberKick: 'Member kicked',
    memberUpdate: 'Member updated',
    botUpdate: 'Bot updated',
    botLeave: 'Bot left',
    memberLeave: 'Member left',
    avatar: 'Avatar',
    avatarRemoved: 'Avatar Removed',
    premiumSince: 'Boosting since',
    communicationDisabledUntil: 'Timed out',
    deaf: 'Server Deafened',
    mute: 'Server Muted',
    guildUpdate: 'Server updated',
    banner: 'Banner',
    bannerRemoved: 'Banner Removed',
    icon: 'Icon',
    iconRemoved: 'Icon Removed',
    splash: 'Splash Image',
    splashRemoved: 'Splash Image Removed',
    maxMembers: 'Maximum Members',
    vanityUrlCode: 'Vanity URL',
    discoverySplash: 'Discovery Splash Image',
    discoverySplashRemoved: 'Discovery Splash Image Removed',
    afkChannelId: 'AFK Channel',
    systemChannelId: 'System Channel',
    rulesChannelId: 'Rules Channel',
    publicUpdatesChannelId: 'Public Updates Channel',
    ownerId: 'Owner',
    premiumProgressBarEnabled: 'Boost Progress Bar Enabled',
    afkTimeout: 'AFK Timeout',
    defaultMessageNotifications: {
     0: 'All Messages',
     1: 'Only Mentions',
    },
    defaultMessageNotificationsName: 'Default Message Notifications',
    explicitContentFilter: {
     0: 'Disabled',
     1: 'Members without Roles',
     2: 'All Members',
    },
    explicitContentFilterName: 'Excplicit Content Filter',
    mfaLevel: {
     0: None,
     1: 'Elevated',
    },
    mfaLevelName: 'MFA Level',
    nsfwLevel: {
     0: 'Default',
     1: 'Explicit',
     2: 'Safe',
     3: 'Age Restricted',
    },
    nsfwLevelName: 'NSFW Level',
    verificationLevel: {
     0: None,
     1: 'Low',
     2: 'Medium',
     3: 'High',
     4: 'Very High',
    },
    memberFlagsName: 'Member Flags',
    memberFlags: {
     AutomodQuarantinedBio: 'Quarantined for User Bio',
     AutomodQuarantinedUsernameOrGuildNickname: 'Quarantined for Username or Nickname',
     BypassesVerification: 'Bypasses Verification',
     CompletedHomeActions: 'Completed Home Actions',
     CompletedOnboarding: 'Completed Onboarding',
     DidRejoin: 'Rejoined',
     StartedHomeActions: 'Started Home Actions',
     StartedOnboarding: 'Started Onboarding',
    },
    verificationLevelName: 'Verification Level',
    preferredLocale: 'Preferred Locale',
    premiumTier: 'Premium Tier',
    welcomeScreenDescription: 'Welcome Screen Description',
    welcomeChannelAdded: 'Welcome Channel added',
    welcomeChannelRemoved: 'Welcome Channel removed',
    welcomeChannelChanged: 'Welcome Channel changed',
    welcomeChannelEmoji: (channel: Discord.GuildChannel) =>
     `Welcome Channel Emoji of \`${channel.name}\` / \`${channel.id}\``,
    togglesNameRemoved: 'Server Features Removed',
    togglesNameAdded: 'Server Features Added',
    systemChannelFlagsNameRemoved: 'Disabled System Channel Features',
    systemChannelFlagsNameAdded: 'Enabled System Channel Features',
    systemChannelFlags: {
     SuppressJoinNotifications: 'Supress Join Notifications',
     SuppressPremiumSubscriptions: 'Supress Boost Notifications',
     SuppressGuildReminderNotifications: 'Supress Server Reminder Notifications',
     SuppressJoinNotificationReplies: 'Supress Join Notification Sticker Reactions',
     SuppressRoleSubscriptionPurchaseNotifications:
      'Supress Role Subscription Purchase Notifications',
     SuppressRoleSubscriptionPurchaseNotificationReplies:
      'Supress Role Subscription Purchase Notification Sticker Reactions',
     GuildFeedRemoved: 'Server Feed removed',
     Pinned: 'Pinned',
     ActiveChannelsRemoved: 'Active Channels removed',
     RequireTag: 'Requires Tag',
     IsSpam: 'Is Spam',
     IsGuildResourceChannel: 'Is Server Resource Channel',
     ClydeAI: 'Clyde AI enabled',
     IsScheduledForDeletion: 'Is Scheduled for Deletion',
    },
    pending: 'Pending',
   },
   channel: {
    descCreateAudit: (
     user: Discord.User,
     channel: Discord.GuildChannel | Discord.AnyThreadChannel,
     type: string,
    ) => `${getUser(user)}has created\n${getChannel(channel, type)}`,
    descCreate: (channel: Discord.GuildChannel | Discord.AnyThreadChannel, type: string) =>
     `${getChannel(channel, type)}was created`,
    descDeleteAudit: (
     user: Discord.User,
     channel: Discord.GuildChannel | Discord.AnyThreadChannel,
     type: string,
    ) => `${getUser(user)}has deleted\n${getChannel(channel, type)}`,
    descDelete: (channel: Discord.GuildChannel | Discord.AnyThreadChannel, type: string) =>
     `${getChannel(channel, type)}was deleted`,
    descUpdateAudit: (
     user: Discord.User,
     channel: Discord.GuildChannel | Discord.AnyThreadChannel,
     type: string,
    ) => `${getUser(user)}has updated\n${getChannel(channel, type)}`,
    descUpdate: (channel: Discord.GuildChannel | Discord.AnyThreadChannel, type: string) =>
     `${getChannel(channel, type)}was updated`,
    descJoinMember: (thread: Discord.ThreadChannel, channelType: string) =>
     `Users have joined\n${getChannel(thread, channelType)}`,
    descLeaveMember: (thread: Discord.ThreadChannel, channelType: string) =>
     `Users have left\n${getChannel(thread, channelType)}`,
    descUpdateStageAudit: (
     channel: Discord.StageChannel,
     channelType: string,
     user: Discord.User,
    ) => `${getUser(user)}has changed\n${getChannel(channel, channelType)}`,
    descUpdateStage: (channel: Discord.StageChannel, channelType: string) =>
     `${getChannel(channel, channelType)}was changed`,
    descCreateStageAudit: (
     channel: Discord.StageChannel,
     channelType: string,
     user: Discord.User,
    ) => `${getUser(user)}has started\n${getChannel(channel, channelType)}`,
    descCreateStage: (channel: Discord.StageChannel, channelType: string) =>
     `${getChannel(channel, channelType)}was started`,
    descDeleteStageAudit: (
     channel: Discord.StageChannel,
     channelType: string,
     user: Discord.User,
    ) => `${getUser(user)}has ended\n${getChannel(channel, channelType)}`,
    descDeleteStage: (channel: Discord.StageChannel, channelType: string) =>
     `${getChannel(channel, channelType)}was ended`,
    descPinCreateAudit: (user: Discord.User, msg: Discord.Message, channelType: string) =>
     `${getUser(user)}has pinned\n${getMessage(msg)}in\n${getChannel(msg.channel, channelType)}`,
    descPinCreate: (msg: Discord.Message, channelType: string) =>
     `${getMessage(msg)}was pinned in\n${getChannel(msg.channel, channelType)}`,
    descPinRemoveAudit: (user: Discord.User, msg: Discord.Message, channelType: string) =>
     `${getUser(user)}has un-pinned\n${getMessage(msg)}in\n${getChannel(msg.channel, channelType)}`,
    descPinRemove: (msg: Discord.Message, channelType: string) =>
     `${getMessage(msg)}was un-pinned in\n${getChannel(msg.channel, channelType)}`,
    descTyping: (user: Discord.User, channel: Discord.GuildTextBasedChannel, channelType: string) =>
     `${getUser(user)}has started typing in\n${getChannel(channel, channelType)}`,
    nameCreate: 'Channel created',
    nameDelete: 'Channel deleted',
    nameTyping: 'User started typing',
    nameUpdate: 'Channel updated',
    nameStageUpdate: 'Stage updated',
    nameStageCreate: 'Stage created',
    nameStageDelete: 'Stage deleted',
    namePin: 'Message pinned',
    nameUnpin: 'Message un-pinned',
    nameJoin: 'Channel joined',
    join: 'Joined Users',
    left: 'Left Users',
    topic: 'Description',
    flagsName: 'Flags',
    flags: {
     ActiveChannelsRemoved: 'Active Channels removed',
     ClydeAI: 'Clyde AI enabled',
     GuildFeedRemoved: 'Guild Feed removed',
     IsGuildResourceChannel: 'Guild Resource Channel',
     IsScheduledForDeletion: 'Scheduled for Deletion',
     IsSpam: 'Spam',
     Pinned: 'Pinned',
     RequireTag: 'Requires a Tag',
    },
    privacyLevelName: 'Privacy Level',
    privacyLevel: {
     1: 'Public',
     2: 'Server Only',
    },
    bitrate: 'Bitrate',
    nsfw: 'NSFW',
    permissions: 'Permissions',
    archived: 'Archived',
    locked: 'Locked',
    invitable: 'Invitable',
    userLimit: 'User Limit',
    rateLimitPerUser: 'Rate Limit per User',
    rtcRegion: 'RTC Region',
    videoQualityModeName: 'Video Quality Mode',
    videoQualityMode: {
     1: 'Auto',
     2: '720p',
    },
    autoArchiveDuration: 'Default Auto-Archive Duration',
    type: 'Channel Type',
    permissionOverwrites: 'Permission Overwrites',
    parentChannel: 'Parent Category',
    newlyCreated: 'Newly Created',
    archiveTimestamp: 'Archive Time',
    deniedPermissions: 'Denied Permissions',
    addedPermissionOverwrite: 'Added Permission Overwrite',
    removedPermissionOverwrite: 'Removed Permission Overwrite',
    changedPermissionOverwrite: 'Changed Permission Overwrite',
    availableTags: 'Available Tags',
    moderated: 'Moderated',
    defaultReactionEmoji: 'Default Reaction Emoji',
    defaultThreadRateLimitPerUser: 'Default Thread Rate Limit per User',
   },
   userUpdate: {
    name: 'User updated',
    desc: (user: Discord.User) => `${getUser(user)}has updated`,
    avatar: 'Avatar',
    banner: 'Banner',
    flags: 'Badges',
    discriminator: 'Tag',
    bannerRemoved: 'Banner Removed',
    username: 'Username',
   },
   automodActionExecution: {
    name: 'Auto-Moderation Rule enforced',
    descMessage: (rule: Discord.AutoModerationRule, msg: Discord.Message, user: Discord.User) =>
     `${getAutoModerationRule(rule)}was enforced on\nthis ${getMessage(msg)}from\n${getUser(user)}`,
    desc: (rule: Discord.AutoModerationRule, user: Discord.User) =>
     `${getAutoModerationRule(rule)}was enforced on\n${getUser(user)}`,
    matchedKeyword: 'Matched Keyword',
    matchedContent: 'Matched Content',
    content: 'Content',
    ruleTriggerTypeName: 'Rule Trigger Type',
    ruleTriggerType: {
     1: 'Keyword Filter',
     3: 'Spam Filter',
     4: 'Keyword Preset Filter',
     5: 'Mention Spam Filter',
     6: 'Profile Filter',
    },
    actionTypeName: 'Action Type',
    actionType: {
     1: 'Block Message',
     2: 'Send Alert Message',
     3: 'Timeout',
     4: 'Block Profile Update or Server Interaction',
    },
    alert: 'Alert sent',
    timeout: 'User timed-out',
    alertChannel: 'Alert Channel',
   },
   automodRule: {
    descCreate: (user: Discord.User, rule: Discord.AutoModerationRule) =>
     `${getUser(user)}created\n${getAutoModerationRule(rule)}`,
    descDelete: (user: Discord.User, rule: Discord.AutoModerationRule) =>
     `${getUser(user)}deleted\n${getAutoModerationRule(rule)}`,
    descUpdate: (user: Discord.User, rule: Discord.AutoModerationRule) =>
     `${getUser(user)}updated\n${getAutoModerationRule(rule)}`,
    nameCreate: 'Auto-Moderation Rule created',
    nameDelete: 'Auto-Moderation Rule deleted',
    nameUpdate: 'Auto-Moderation Rule updated',
    keywordFilter: 'Triggering Keywords',
    presetsName: 'Used Preset',
    addedActions: 'Added Actions',
    removedActions: 'Removed Actions',
    changedActions: 'Changed Actions',
    regexPatterns: 'Regex Patterns',
    presets: {
     1: 'Profanity',
     2: 'Sexual Content',
     3: 'Slurs',
    },
    allowList: 'Allowed Words',
    mentionTotalLimit: 'Mention Limit',
    mentionRaidProtectionEnabled: 'Raid Protection Enabled',
    enabled: 'Enabled',
    eventTypeName: 'Event Type',
    defaultMessage:
     "This can't be posted because it contains content blocked by this server. This may also be viewed by server owners.",
    eventType: {
     1: 'Message Send',
     2: 'Member Update',
    },
    triggerTypeName: 'Trigger Type',
    triggerType: {
     1: 'Keyword',
     2: 'Harmful Link',
     3: 'Spam',
     4: 'Keyword Preset',
     5: 'Spam',
    },
    exemptRoles: 'Exempt Roles',
    exemptChannels: 'Exempt Channels',
    actionsTypeName: 'Actions Type',
    actionsType: {
     1: 'Block Message',
     2: 'Send Alert Message',
     3: 'Timeout',
     4: 'Block Profile Update or Server Interaction',
    },
    alertChannel: 'Alert Channel',
    timeoutDuration: 'Timeout Duration',
    actions: 'Actions',
    warnMessage: 'Warn Message',
   },
  },
  guildMemberUpdate: {
   rewards: {
    memberLeft: 'Custom-Role Owner left the Server',
    reqLost: 'Custom-Role Owner lost privilege to own this Role',
    desc: (roles: string[]) =>
     `You meet Requirements for a Reward as you own at least one of the following Roles:\n${roles
      .map((r) => `<@&${r}>`)
      .join(', ')}`,
    customRoleName: 'Custom-Role',
    customRole: (commandId: string) =>
     `Claim a Custom Role using </custom-role:${commandId}>\nIf you stop meeting the Requirements the Role will be deleted`,
    xpName: 'XP',
    xp: (amount: number) =>
     `You will get an XP Multiplier of ${amount}x as long as you meet the Requirements`,
    currencyName: 'Currency',
    currency: (amount: number) =>
     `You have received ${amount} ${ch.constants.standard.getEmote(ch.emotes.book)}`,
   },
  },
  guildMemberAdd: {
   welcome: {
    embed: 'Welcome {{member}} to {{member.guild.name}}!',
    test: 'Test Welcome Message',
   },
  },
  censor: {
   censoredMessageReposter: 'Censored Message Reposter',
  },
  ready: {
   channelunban: 'Automatically Channel-Unbanned',
   unban: 'Automatically Un-Banned',
   unmute: 'Automatically Un-Muted',
   disboard: {
    desc: `You can now Bump this Server again!\n\nPlease type </bump:947088344167366698>`,
    title: `${name} DISBOARD Bump Reminder`,
   },
   reminder: {
    description: 'Your reminder is due!',
    failedMsg: (channel: { id: bigint }) =>
     `I tried to send a Message in the Channel you set the Reminder in <#${channel.id}>, but I failed.`,
   },
   vote: {
    author: '12 Hours are over!',
    description: (votegain: Strumber) =>
     `If you want to keep your multiplier streak up, ([click and vote](https://top.gg/bot/650691698409734151/vote))\nYour multiplyer is currently ${votegain}x`,
   },
   nitro: {
    stackRoles: (user: Discord.User, roles: Discord.Role[], days: Strumber) =>
     `${getUser(user)}has been given\n${roles
      .map((r) => getRole(r))
      .join('')}for boosting longer than ${days} days`,
    replaceRoles: (user: Discord.User, roles: Discord.Role[], days: Strumber) =>
     `The Booster-Roles of\n${getUser(user)}have been replaced with\n${roles
      .map((r) => getRole(r))
      .join('')}for boosting longer than ${days} days`,
    started: (user: Discord.User) => `${getUser(user)}has started boosting the Server`,
    stopped: (user: Discord.User) => `${getUser(user)}has stopped boosting the Server`,
   },
  },
  vote: {
   bot: (user: Discord.User, bot: Discord.User, link: string) =>
    `Thanks to **${user.displayName}** for voting for [${bot.username}](${link})!`,
   guild: (user: Discord.User, guild: Discord.Guild, link: string) =>
    `Thanks to **${user.displayName}** for voting for [${guild.name}](${link})!`,
   reward: (reward: string) => `\nYou have received ${reward} for the next 12 hours.`,
   xpmultiplier: 'XP Multiplier',
   botReason: (bot: Discord.User) => `Voted for ${bot.username}`,
   guildReason: (guild: Discord.Guild) => `Voted for ${guild.name}`,
   endReason: 'Vote ran out',
   reminder: {
    name: 'You can vote again!',
    descBot: (bot: Discord.User) =>
     `Your Vote time-out for \`${ch.constants.standard.user(bot)}\` has ended`,
    descGuild: (guild: Discord.Guild) => `Your Vote time-out for \`${guild.name}\` has ended`,
    voteBot: (bot: Discord.User) => `[Click here to Vote again](https://top.gg/bot/${bot.id}/vote)`,
    voteGuild: (guild: Discord.Guild) =>
     `[Click here to Vote again](https://top.gg/servers/${guild.id}/vote)`,
    voteBotButton: (bot: Discord.User) => `Vote for ${bot.username}`,
    voteGuildButton: (guild: Discord.Guild) => `Vote for ${guild.name}`,
    voteAyakoButton: `Vote for ${name}`,
    disable: 'Disable all Vote Reminders',
   },
  },
  appeal: {
   title: 'New Appeal',
   author: `${client.user?.username} Punishment Appeal System`,
   description: (user: Discord.User, id: Prisma.Decimal) =>
    `${getUser(user)}has appealed their Punishment\n${getPunishment(id)}`,
  },
  interactionCreate: {
   cooldown: (t: string) => `This Command is on Cooldown for ${t}`,
  },
 },
 systemChannelFlags: {
  SuppressJoinNotifications: '`Suppress Member join Notifications`',
  SuppressPremiumSubscriptions: '`Suppress Server Boost Notifications`',
  SuppressGuildReminderNotifications: '`Suppress Server Setup Tips`',
  SuppressJoinNotificationReplies: '`Hide Member join Sticker reply Buttons`',
 },
 channelTypes: {
  0: 'Text Channel',
  1: 'DM Channel',
  2: 'Voice Channel',
  3: 'Group DM Channel',
  4: 'Category',
  5: 'Announcements Channel',
  6: 'Store Channel',
  10: 'Public Thread Channel',
  11: 'Public Thread Channel',
  12: 'Private Thread Channel',
  13: 'Stage Channel',
  14: 'Directory Channel',
  15: 'Forum Channel',
 },
 verification: {
  title: `${name} Verification`,
  verify: 'Verify',
  startchannelmessage: 'Press the Button below to re-/start Verification!.',
  description: (guild: Discord.Guild) =>
   `<a:AMtoiletspin:709805618030182510> **Welcome to \`${guild.name}\`!**`,
  finishDesc: '**Thank you for verifying!**\nVerification Finished!',
  kickMsg: (guild: Discord.Guild) =>
   `You have been kicked from \`${guild.name}\` because you didn't verify.\nYou can rejoin anytime with a valid Invite Link`,
  hintmsg:
   'Type out the traced colored Characters from left to right ➡️\nIgnore all gray decoy Characters\nIgnore Character Cases (upper & lower case)\nThe captcha contains 5 digits',
  kickReason: `${name} Verification | Unverified for too long`,
  wrongInput: (solution: string) =>
   `That was wrong... Are you a robot?\nThe solution was \`${solution}\`\nPlease try again`,
  alreadyVerified: 'You are already verified',
  log: {
   start: (user: Discord.User) => `${getUser(user)}started Verification`,
   end: (user: Discord.User) => `${getUser(user)}finished Verification`,
   started: 'Verification Started',
   finished: 'Verification Finished',
  },
  hint: 'Hint',
  enterCode: 'Enter Code',
 },
 time,
 expire: {
  punishmentIssue: 'Punishment was issued at',
  punishmentOf: (target: Discord.User) =>
   `A Punishment of ${ch.constants.standard.user(target)} has expired`,
  punishmentIn: 'Punished in',
  punishmentBy: 'Punished by',
  end: 'Punishment End',
  endedAt: (t: string) => `Punishment ended ${t}`,
  duration: 'Punishment Duration',
  pardonedBy: 'Pardoned by',
 },
 commands: {
  noArgs: {
   content: 'No Arguments provided',
   button: 'Show Usage',
  },
 },
 contextCommands: {
  message: {
   'Stick Message': {
    desc: 'Stick a Message to the Channel',
    reply:
     'Message was sticked to the channel\nYou can undo this at any time by deleting the sticked Message',
    button: 'Delete this Message to unstick it',
    already:
     'This Channel already has a sticked Message.\nYou can merge them into one and stick the merged Message\n\nTo unstick the previous Message, just delete it',
   },
  },
  user: {
   TODO: {
    desc: 'TODO',
   },
  },
 },
 stringCommands: {},
 slashCommands: {
  suggest: {
   accepted: 'Suggestion accepted',
   rejected: 'Suggestion rejected',
   notOwner:
    "Only the Submitter of the Suggestion and Suggestion-Approvers can use this Button\nOr this Suggestion couldn't be found",
   banned: (user: Discord.User) => `${getUser(user)}was banned from submitting Suggestions`,
   cantBan: (cmdId: string) => `**You can't ban this User**
Either because Suggestions aren't enabled on this Server
because you are lacking the Permissions to
or because they are already banned

Unban Users in </settings automation suggestions:${cmdId}>`,
   tldr: 'TL;DR',
   downvotes: 'Downvotes',
   upvotes: 'Upvotes',
   anonVote: 'Votes are Anonymous',
   notFound: 'Suggestion not found or ended',
   cannotSend: "You can't submit Suggestions",
   cannotVote: "You can't vote on Suggestions",
   notEnabled: "Suggestions aren't enabled on this Server",
   author: `${name} Suggestions`,
   votes: 'Votes',
   view: 'View Votes',
   accept: 'Accept',
   reject: 'Reject',
   sent: `Suggestion submitted\nYou can delete it using the ${ch.constants.standard.getEmote(
    ch.emotes.trash,
   )} Button on your Suggestion`,
  },
  reminder: {
   reminderNotExist: "This Reminder doesn't exist",
   deleted: 'Reminder deleted',
   created: (reminderID: string) =>
    `Reminder created\nView your Reminders with </reminder list:${reminderID}>`,
   edited: 'Reminder edited',
   desc: (reminderID: string | undefined) =>
    `To create a Reminder use </reminder create:${reminderID}>\nto edit one, use </reminder edit:${reminderID}>\nand to delete one, use </reminder delete:${reminderID}>`,
   tooShort: 'The Duration must be at least 10 Seconds',
   reminderEnded: (userId: string) => `<@${userId}> Your Reminder has ended.`,
  },
  clear: {
   noMessagesFound: 'No matching Messages found',
   deleted: (amount: number) =>
    `I was able to find ${amount} Messages in the last 500 Messages that matched the Requirements\n> *I can only delete Messages younger than 14 Days old*`,
  },
  selfroles: {
   notEnabled: 'There are no Self-Roles on this Server',
   selectCategory: 'Please only select Categories from the Select-Menu',
   selectOne: 'Select a Role',
   selectMany: 'Select Roles',
   removeRole: 'You already have this Role, selecting it again will remove it',
  },
  moderation: {
   permissions: {
    desc:
     'If you want to limit Moderation-Command Access, you can split the `/mod` Command into several smaller ones using the Buttons below\n\nThese Buttons can only be used by Server Managers',
    buttons: {
     strike: 'Strike',
     warn: 'Warn',
     ban: 'Ban',
     'channel-ban': 'Channel-Ban',
     'channel-unban': 'Channel-Unban',
     kick: 'Kick',
     'soft-ban': 'Soft-Ban',
     'soft-warn': 'Soft-Warn',
     'temp-ban': 'Temp-Ban',
     'temp-channel-ban': 'Temp-Channel-Ban',
     tempmute: 'Tempmute',
     unafk: 'Un-AFK',
     unmute: 'Unmute',
     unban: 'Unban',
     pardon: 'Pardon',
    },
   },
   strike: {
    areYouSure: (user: Discord.User, punishment: string) =>
     `You are about to strike **${user}**\nDue to their Amount of Warns, this will ${punishment} them\n**Do you want to proceed?**`,
    confirmAuthor: 'Confirm Strike',
    notEnabled: (cmdId: string) =>
     `The Strike-System is not enabled\nuse </settings auto-moderation:${cmdId}> to enable it`,
   },
   unafk: {
    notAfk: (user: Discord.User) => `${getUser(user)}is not AFK.`,
    unAfk: (user: Discord.User) => `AFK of\n${getUser(user)}deleted`,
   },
  },
  vote: {
   desc: 'Vote for Ayako',
   content: 'You can vote for me on [here](https://top.gg/bot/650691698409734151/vote)',
  },
  slowmode: {
   deleted: (channel: Discord.GuildChannel) => `Slomode of Channel ${channel} deleted`,
   success: (channel: Discord.GuildChannel, t: string) =>
    `Slowmode of Channel ${channel} set to \`${t}\``,
  },
  pardon: {
   author: 'Punishment Pardoned',
   target: 'Target',
   executor: 'Executor',
   punishedIn: 'Punished in',
   punishedAt: 'Punished at',
   duration: 'Duration',
   endedAt: 'Ended at',
   pardoned: (id: string, targetID: string) =>
    `Punishment with ID \`${id}\` was pardoned from <@${targetID}>`,
   pardonedMany: (ids: string, targetID: string) =>
    `Punishments with IDs ${ids} were pardoned from <@${targetID}>`,
   pardonedManyBy: (ids: string, targetID: string) =>
    `Punishments with IDs ${ids} executed by <@${targetID}> were pardoned`,
   pardonReason: 'Pardon Reason',
   username: 'Username at execution Time',
   channel: 'Channel Name at execution Time',
  },
  help: {
   title: 'Slash, Context and Prefix Commands',
   categories: {
    moderation: 'Moderation',
    info: 'Info',
    utility: 'Utility',
    fun: 'Fun',
    settings: 'Settings',
    roles: 'Roles',
    vote: 'Vote',
    nitro: 'Nitro',
    automation: 'Automation',
    leveling: 'Leveling',
   },
   parentCommands: 'The Parent-Commands in this Category are:',
   subCommandGroups: 'The Sub-Command-Groups in this Category are:',
   footer: 'A "?" in the Option Name means that the Option is optional',
   selectPlaceholder: 'Select a Category to view',
   selectCommand: 'Select a Command to view',
   author: 'Help for Commands, Sub-Command-Groups, Sub-Commands, and their Arguments',
   clickMe: 'Click me to join the Support Server',
  },
  afk: {
   set: (user: Discord.User) => `\`${ch.constants.standard.user(user)}\` went AFK`,
   updated: 'AFK updated',
   removed: (t: string) => `Welcome Back!\nYou've been AFK since ${t}`,
   setReason: 'User went AFK',
   removeReason: 'User returned from AFK',
   isAFK: (user: string, since: string, text?: string) =>
    `<@${user}> is AFK since ${since}${text ? `\n${text}` : ''}`,
  },
  roles: {
   shop: {
    bought: `Shop-Item bought and equipped\nTo unequipt use the Button again`,
    equipt: `Shop-Item equipped\nTo unequipt use the Button again`,
    unequipt: `Shop-Item unequipped\nTo equipt use the Button again`,
    alreadyBought: `You already own this`,
    notBought: `You don't own this`,
    notEnoughMoney: (emote: string) => `You don't have enough ${emote} to buy this`,
    equip: `Equip Roles`,
    unequip: `Unequip Roles`,
    buyTheseFor: (amount: string) => `Buy these Roles for ${amount}`,
    buyThisFor: (amount: string) => `Buy this Role for ${amount}`,
    selRoleToBuy: 'Select a Role to buy',
    selRoleToEquip: 'Select a Role to un/equip',
    description: (balance: number, emote: string, cId: string) =>
     `Your current Balance is ${ch.util.makeInlineCode(
      String(ch.splitByThousand(balance)),
     )} ${emote}\nYou can check your Balance at any time using </balance:${cId}>\n\nBuy Roles through the Select-Menu below`,
    notEnabled: 'Role Shop is not enabled or there are no Roles in the Shop',
    oneRole: (link: string) => `This Role can be bought [here](${link})`,
    manyRoles: (link: string) => `These Roles can be bought [here](${link})`,
   },
   customRole: {
    notEnabled: 'Setting Custom-Roles is not enabled',
    cantSet: "You don't qualify to set a Custom-Role",
    edit: (role: Discord.Role, limit: { icon: boolean; color: boolean }) =>
     `${getRole(
      role,
     )}was created\n\n__Applying limits:__\nCan set Role-Icon ${ch.constants.standard.getEmote(
      limit.icon ? ch.emotes.enabled : ch.emotes.disabled,
     )}\nCan set Role-Color ${ch.constants.standard.getEmote(
      limit.color ? ch.emotes.enabled : ch.emotes.disabled,
     )}`,
    create: (role: Discord.Role, limit: { icon: boolean; color: boolean }) =>
     `${getRole(
      role,
     )}was created\n\n__Applying limits:__\nCan set Role-Icon ${ch.constants.standard.getEmote(
      limit.icon ? ch.emotes.enabled : ch.emotes.disabled,
     )}\nCan set Role-Color ${ch.constants.standard.getEmote(
      limit.color ? ch.emotes.enabled : ch.emotes.disabled,
     )}`,
   },
   builders: {
    descReactions: (cmdId: string) =>
     `React to the Message with the Emojis you want to use\nYou can add up to 25 Reactions in total and 10 Roles per Reaction\nFor extended Settings visit </settings roles reaction-role-settings:${cmdId}>\n__Notice:__ Emotes might not display properly below, but they will work just fine as long as you don't remove ${name}'s Reaction`,
    descButtons: (cmdId: string) =>
     `React to the Message with the Emojis you want to use\nYou can add up to 25 Buttons in total and 10 Roles per Button\nFor extended Settings visit </settings roles button-role-settings:${cmdId}>\n__Notice:__ Emotes might not display properly below, but they will work just fine`,
    buttons:
     '`React Here` leads you to the Message to add Reactions on\n`Refresh Command` refreshes Builder to apply your newly added Reactions\n`Reset Reactions` resets the Reactions on the Reaction-Message to only show Reactions current define in the Builder',
    reactHere: 'React Here',
    refreshCommand: 'Refresh Selection',
    resetReactions: 'Reset Reactions',
    chooseEmoji: 'Choose Emoji',
    chooseRoles: 'Choose Roles',
    saveAndExit: 'Save and Exit',
    couldntReact:
     "I couldn't add Reactions to this Message\nThis is not required, but make sure your Reaction will not be removed from it",
    messageNotFromMe: (cmdId: string) =>
     `I can't add Buttons to a Message I didn't send.\nConsider using the </embed-builder create:${cmdId}> to create a Custom Message through me\nor using Reaction-Roles instead`,
    selectedEmoji: 'Selected Emoji:',
   },
   create: (role: Discord.Role) => `Successfully created Role ${role}`,
   edit: (role: Discord.Role) => `Successfully edit Role ${role}`,
   delete: {
    areYouSure: (role: Discord.Role) => `Are you sure you want to delete the Role ${role}?`,
    deleted: (role: Discord.Role) => `Successfully deleted ${getRole(role)}`,
   },
   give: {
    administrator:
     'This Role has Dangerous Permissions.\nPlease give it manually in the Roles Tab of your Server',
    alreadyHas: (role: Discord.Role, user: Discord.User) => `${user} already has ${role}`,
    given: (role: Discord.Role, user: Discord.User) => `Successfully given ${role} to ${user}`,
   },
   take: {
    administrator:
     'This Role has Dangerous Permissions.\nPlease take it manually in the Roles Tab of your Server',
    doesntHave: (role: Discord.Role, user: Discord.User) => `${user} doesn't have ${role}`,
    taken: (role: Discord.Role, user: Discord.User) => `Successfully taken ${role} from ${user}`,
   },
  },
  interactions: {
   awoo: {
    self: 'Awoo!!',
    noOne: 'Awoo!!',
    others: "awoo's at",
    buttons: ['Pat them!', 'Awoo together!'],
   },
   angry: {
    self: 'Grrr!',
    noOne: 'Grrr!',
    others: ['is angry at', '>:('],
    buttons: ['Cry ;-;', 'Run away!'],
   },
   ayaya: {
    self: 'Ayaya!!',
    noOne: 'Ayaya!!',
    others: "ayaya's at",
   },
   baka: {
    self: 'thinks they themself are a Baka??',
    noOne: 'thinks everyone in Chat is a Baka!',
    one: ['thinks', 'is a Baka!'],
    many: ['thinks', 'are Bakas!'],
    buttons: ['Bonk them!', 'No you!'],
   },
   bath: {
    self: 'bathes themself, they are so clean',
    noOne: 'is bathing and blowing bubbles 🫧',
    others: 'bathes with',
    request: 'wants to bathe with you!',
    buttons: ['Bathe together~', 'Pat them', 'Bonk them'],
   },
   bite: {
    self: 'bites themself, how did they get that way?',
    others: 'bites',
    buttons: ['Revenge!', 'Pat them!', 'Bonk them!'],
   },
   blush: {
    self: 'blushes because of their own actions, what a sub~',
    noOne: 'blushes',
    others: 'blushes at',
    buttons: ['Pat them!', 'Tickle fight!', 'Kiss them!', 'Boop the hekk outta em'],
   },
   bonk: {
    self: "bonks themself, at least I didn't have to do it",
    others: 'bonks',
    buttons: ['Bonk them! >:(', 'Cry ;-;'],
   },
   bored: {
    self: 'is bored',
    noOne: 'is bored',
    others: 'is bored because of',
    buttons: ['Bonk them!', 'Tickle fight!'],
   },
   comfy: {
    self: 'is comfy',
    noOne: 'is comfy',
    others: 'makes themself comfy with',
    request: 'wants to get comfy with you!',
    buttons: ['Cuddle together', 'Pat them'],
   },
   cry: {
    self: 'cries at themself, how sad',
    noOne: 'cries <:AMayakocry:924071113586253884>',
    others: 'cries at',
    buttons: ['Pat them', 'Comfort them', 'Hold them'],
   },
   cuddle: {
    self: 'cuddles themself, how does that even work',
    others: 'cuddles with',
    request: 'wants to cuddle with you!',
    buttons: ['Cuddle them', 'Pat them'],
   },
   dance: {
    self: 'dances with themself, be proud of who you are!',
    noOne: 'dances',
    others: 'dances with',
    request: 'wants to dance with you!',
    buttons: ['Dance together~', 'Pat them'],
   },
   facepalm: {
    self: 'facepalms at their own actions, how unexpected',
    noOne: 'facepalms',
    others: 'facepalms at',
   },
   feed: {
    self: "feeds themself, wait.. isn't that just eating?",
    others: 'feeds',
   },
   floof: {
    self: 'floofs their tail, how cute~',
    many: ['floofs', 'tails'],
    one: ['floofs', 'tail'],
    buttons: ['Embrace the floofs~', 'Hide away >~>'],
   },
   fluff: {
    self: 'fluffs their tail, how cute~',
    many: ['fluffs', 'tails'],
    one: ['fluffs', 'tail'],
    buttons: ['Embrace the fluffs~', 'Hide away >~>'],
   },
   handshake: {
    self: 'shakes themself, wait what',
    many: ['shakes hands', "'s hand"],
    one: ['shakes', "'s hand"],
    request: 'wants to shake your hand!',
    buttons: ['🤝'],
   },
   happy: {
    self: "is happy because of themself, that's nice",
    noOne: 'is happy',
    others: 'is happy because of',
    buttons: ['Pat them!', 'Hug them!'],
   },
   highfive: {
    self: 'highfives themself, someone left them hanging >~>',
    others: 'highfives',
    request: 'holds their hand up, waiting for a high-five!',
    buttons: ['High-five!'],
   },
   holdhands,
   handhold: holdhands,
   comfort: {
    self: "shhh, It's alright. Everything will be fine",
    others: 'comforts',
    buttons: ['Cry quietly', 'Snuggle together'],
   },
   hold: {
    self: 'holds themself very very tight. They are so lonely',
    others: ['holds', 'very tight'],
    buttons: ['Cry quietly', 'Nuzzle together'],
   },
   hug: {
    self: 'hugs themself, that looks quite sad...',
    others: 'hugs',
    buttons: ['Hug back!'],
   },
   kidnap: {
    self: "kidnaps themself, I don't think it works that way",
    others: 'kidnaps',
    buttons: ['Be stolen c:', 'Run away!'],
   },
   kith: {
    self: 'kithes themself, they are in great danger.',
    others: 'kithes with',
    request: 'wants to kith you~! >~<',
    buttons: ['Kith~', 'Bonk em'],
   },
   pash: {
    self: 'pashes themself, classic aussie',
    others: 'pashes with',
    request: 'wants to pash you~! >~<',
    buttons: ['Pash~', 'Bonk em'],
   },
   smooch: {
    self: 'smooches themself, please get help',
    others: 'smooches with',
    request: 'wants to smooch you~! >~<',
    buttons: ['Smooch~', 'Bonk em'],
   },
   kiss: {
    self: 'kisses themself, how do you even do that??',
    others: 'kisses with',
    request: 'wants to kiss you~! >~<',
    buttons: ['Kiss~!', 'Bonk em'],
   },
   mwah: {
    self: 'kisses themself, how do you even do that??',
    others: 'kisses with',
    request: 'wants to mwah you~! >~<',
    buttons: ['Mwah them~', 'Bonk em'],
   },
   laugh: {
    self: 'laughs at themself, something must be funny',
    noOne: 'laughs',
    others: 'laughs at',
    buttons: ['Peck them', 'Bonk em'],
   },
   lay: {
    self: 'is laying around',
    noOne: 'is laying around',
    others: 'lays with',
    buttons: ['Fluff em good~', 'Cuddle them ^-^', 'Pat them :3c'],
   },
   lewd: {
    self: 'lewds themself, get a room!!',
    noOne: 'is lewd!!',
    others: 'lewds',
    buttons: ['Run away', 'No you!', 'Hide away <~<'],
   },
   lick: {
    self: "licks themself, at least you don't need a shower now, I guess...",
    others: 'licks',
    buttons: ['Lick back!', 'Bonk them', 'Blush #~#'],
   },
   pickup: {
    self: 'picks themself up, but how..?',
    others: ['picks', 'up'],
    buttons: ['Enjoy getting carried around~', 'Bite them!'],
   },
   lift: {
    self: 'lifts themself up, how the hecc???',
    others: ['lifts', 'up'],
    buttons: ['Enjoy getting carried around~', 'Bite them!'],
   },
   lurk: {
    self: 'lurks in Chat <:AMayakopeek:924071140257841162>',
    noOne: 'lurks in Chat <:AMayakopeek:924071140257841162>',
    others: 'lurks at',
    buttons: ['Pat them', 'Hug them'],
   },
   nam: {
    self: 'get nammed on, I guess',
    others: 'nams on',
    buttons: ['Nam back!'],
   },
   nom: {
    self: 'noms on themself. I mean if you have no one else to nom, why not?',
    others: 'noms on',
    buttons: ['Nom back!'],
   },
   nuzzle: {
    self: 'nuzzles into themself, probably to find out if they should take a shower',
    others: ['lets', 'nuzzle into them'],
    request: 'wants to nuzzle into you!',
    buttons: ['Nuzzle together~', 'Bonk òwó'],
   },
   mew: {
    self: 'Mew =^_^=',
    noOne: 'Mew =^_^=',
    others: ['mews at', '=^_^='],
    buttons: ['Mew back~', 'Pat them!', 'Woof!'],
   },
   meow: {
    self: 'Meow =^_^=',
    noOne: 'Meow =^_^=',
    others: ['meows at', '=^_^='],
    buttons: ['Meow back~', 'Pat them!', 'Woof!'],
   },
   nya: {
    self: 'Nya~ :3',
    noOne: 'Nya~ :3',
    others: ['nyas at', ':3'],
    buttons: ['Pat them!', 'Woof!', 'Nya back~ =w='],
   },
   pat: {
    self: 'pats themself, what an odd thing to do',
    others: 'pats',
    buttons: ['Blush~ #~#', 'Enjoy the pats <3', 'Pout >~>'],
   },
   peck: {
    self: "pecks themself, you physically can't do that...",
    others: 'pecks',
    buttons: ['Blush~ #~#', 'Peck back!'],
   },
   peek: {
    self: 'peeks into Chat <:AMayakopeek:924071140257841162>',
    noOne: 'peeks into Chat <:AMayakopeek:924071140257841162>',
    others: 'peeks at',
    buttons: ['Pat them', 'Lurk together ^-^'],
   },
   boop: {
    self: 'boops themself, how cute',
    others: 'boops',
    buttons: ['Pat them', 'Nom their finger >;3'],
   },
   poke: {
    self: 'pokes themself, how cute',
    others: 'pokes',
    buttons: ['Pat them', 'Kiss them~', 'Hug them'],
   },
   pout: {
    self: "pouts at themself, guess they shouldn't have said that",
    noOne: 'pouts *Hmpf!*',
    others: 'pouts at',
    buttons: ['Pat them'],
   },
   quack: {
    self: 'quacks around',
    noOne: '**QUACK!!**',
    others: 'quacks at',
    buttons: ['Pat them', 'Quack back!'],
   },
   run: {
    self: 'runs from themself, how did they get here?',
    noOne: 'runs from Chat',
    others: 'runs from',
   },
   scream: {
    self: 'screams at themself, they should get some help',
    noOne: 'screams.. just screams...',
    others: 'screams at',
    buttons: ['Shake em back to reality'],
   },
   shake: {
    self: 'is shaking. They must be cold.. or on caffeine',
    others: 'shakes',
    buttons: ['SCREAM °O°', 'Cry ;-;'],
   },
   shrug: {
    self: 'shrugs at themself? Weird',
    noOne: 'shrugs',
    others: 'shrugs at',
   },
   sigh: {
    self: '*sigh*',
    others: 'sighs at',
   },
   sleep: {
    self: 'sleeps alone tonight >~>',
    noOne: 'sleeps',
    others: 'sleeps with',
    request: 'wants to sleep together with you!',
    buttons: ['Sleep together~', 'Nope away'],
   },
   eep: {
    self: 'eeps alone tonight >~>',
    noOne: 'eeps',
    others: 'eeps with',
    request: 'wants to eep together with you!',
    buttons: ['eep together~', 'Nope away'],
   },
   smile: {
    self: 'smiles at themself, how nice',
    noOne: 'smiles >^<',
    others: 'smiles at',
    buttons: ['Be happy together!'],
   },
   smug: {
    self: 'smugs at themself, they probably did something dirty...',
    noOne: 'smugs at Chat',
    others: 'smugs at',
    buttons: ['Poke them'],
   },
   snuggle: {
    self: "snuggles with themself, try snuggling someone else maybe, you wouldn't look that lonely",
    others: 'snuggles with',
    request: 'wants to snuggle you!',
    buttons: ['Snuggle together~'],
   },
   stare: {
    self: 'stares at themself, they are staring at themself!!',
    others: 'stares at',
    buttons: ['Stare back °-°'],
   },
   wag: {
    self: 'wags their tail at themself, adorable~',
    noOne: 'wags their tail at Chat',
    others: 'wags their tail at',
    buttons: ['Fluff em!'],
   },
   lapsleep: {
    self: 'sleeps on their own lap, it seems they are quite agile',
    others: ['lets', 'sleep on their lap'],
    request: 'wants to sleep on your lap!',
    buttons: ['Get comfy~'],
   },
   thighsleep: {
    self: 'sleeps on their own thighs, it seems they are quite agile',
    others: ['lets', 'sleep on their thighs'],
    request: 'wants to sleep on your thighs!',
    buttons: ['Get comfy~'],
   },
   think: {
    self: 'thinks about themself, must be a thinker',
    noOne: 'is thinking',
    others: 'thinks about',
   },
   thumbsup: {
    self: 'agrees with themself',
    noOne: 'agrees with Chat',
    others: 'agrees with',
    buttons: ['🤝'],
   },
   tickle: {
    self: 'tickles themself, being able to tickle yourself is very rare',
    others: 'tickles',
    buttons: ['Scream °O°', 'Run away!'],
   },
   wave: {
    self: 'waves at Chat <:AMayakowave:924071188957913108>',
    noOne: 'waves at Chat <:AMayakowave:924071188957913108>',
    others: 'waves at',
    buttons: ['Wave back o/', 'Boop them >~<'],
   },
   wink: {
    self: 'winks at themself, for some reason..',
    noOne: 'winks at Chat c;',
    others: 'winks at',
   },
   yeet: {
    self: 'yeets themself, at least they are gone now',
    others: 'yeets',
   },
   yawn: {
    self: 'yawns at themself, sounds like someone needs a nap~',
    noOne: 'yawns',
    others: 'yawns at',
    buttons: ['Cuddle them', 'Boop them!'],
   },
   woof: {
    self: 'Woof~ :3',
    noOne: 'Woof~ :3',
    others: ['woofs at', ':3'],
    buttons: ['Pat them', 'Nya~ ^~^'],
   },
   kick: {
    self: 'kicks themself, why though?',
    others: ['kicks', 'out of chat'],
    buttons: ['Cry at them ;-;'],
   },
   nod: {
    self: 'yep yep~',
    noOne: 'agrees with Chat',
    others: 'agrees with',
    buttons: ['🤝'],
   },
   nope: {
    self: 'uuuuuuuh nope-',
    noOne: 'nopes the heck away',
    others: 'disagrees with',
   },
  },
  img: {
   madeBy: 'Made by:',
   viewArtist: 'View Artist',
   viewOriginal: 'View Original',
  },
  rp: {
   allBlockedUsers: 'All Users you have blocked',
   cantRP: "You can't use RP-Commands on this Users as either of you has blocked the other.",
   notBlocked: (user: Discord.User) => `${getUser(user)}is not blocked from using RP-Commands`,
   unblock: 'Unblock User',
   unblocked: (user: Discord.User) =>
    `${getUser(user)}is no longer blocked from using RP-Commands on you`,
   blocked: (user: Discord.User) => `${getUser(user)}blocked from using RP-Commands on you`,
   blockPlaceholder: 'Select Commands to switch their Block-Status',
   availableCmds: `Allowed Commands:`,
   blockedCmds: `Blocked Commands:`,
   gifSrc: 'Gif Source Anime:',
   author: `${name} Roleplay Command Manager`,
   desc: `${name} supports a wide variety of Roleplay Commands.

**This Command serves as a Base-Command for all Roleplay-Commands.**
Editing the Permissions of this Command will affect all Roleplay-Commands.
To be able __to use Permission syncing, please log into ${name}'s [Website](https://ayakobot.com/login)__ with the Button below. 
After you edited the Permissions of this Command, use the \`Sync Permissions\` Button below to sync them.

Additionally you can enable (or disable) Server-Roleplay Slash-Commands with the Button \`RP-Commands\`.
__You don't need to lock this Command for certain Roles__ as this would affect all RP-Commands, the Buttons below can only be used by Server Managers.

__Notice__: When re-enabling Slash-Commands you will have to re-sync them afterwards.`,
   fields: (t: string, used: number) => [
    {
     name: 'Permission Syncing can only be used __once__ per Hour',
     value: `Last time you've used it was ${t}`,
    },
    {
     name: 'RP-Commands can only be enabled __twice__ per Day',
     value: `You have used it ${used}x today`,
    },
   ],
   button: 'RP-Commands',
   sync: 'Sync Permissions',
   notice: (cmdId: string) =>
    `There is an additional Roleplay-Management-Command called </rp manager:${cmdId}>.\nVisit it to find out how to manage Permissions for Roleplay Commands,\nand to figure out how to set up Roleplay Slash-Commands on your Server`,
   delay: 'This Operation might take a while to finish, please be patient',
   syncing: 'Syncing Permissions...',
   synced: 'Synced',
  },
  stp: {
   button: 'Click here to view all invokable Properties',
   warn: 'You can only invoke children marked as "Properties"',
  },
  embedbuilder: {
   inherit: {
    title: 'Embed Code',
    label: 'Past your Embed Code below',
    placeholder0: 'Embed Code can be split into all displayed Fields',
    placeholder1: 'Please do not escape the Code',
    placeholder2: `${name} will merge the code of all Fields together`,
    placeholder3: 'Properly escaping the Code will cause Errors',
    placeholder4:
     "Also Embeds have a maximum Length of 6000 Characters, so you probably won't ever need this one",
   },
   create: {
    start: {
     methods: {
      startOver: 'Start Over',
      selectSaved: 'Select saved Embed',
      inheritCode: 'Inherit with Code',
      inheritCustom: 'Inherit custom Embed',
      deleteCustom: 'Delete custom Embed',
     },
     desc:
      'Before getting started\nDo you want to\n**Start with a new Embed**,\n**Inherit a previously saved Embed**,\n**Edit and overwrite a previously saved Embed**,\n**Inherit any Embed I have access to**,\nor **Inherit an Embed with its Code**',
     createButtons: {
      selectMenu: {
       'author-name': 'Author Name',
       'author-icon': 'Author Icon URL',
       'author-url': 'Author URL',
       thumbnail: 'Thumbnail',
       title: 'Title',
       url: 'URL',
       description: 'Description',
       image: 'Image',
       color: 'Color',
       'footer-text': 'Footer Text',
       'footer-icon': 'Footer Icon URL',
       timestamp: 'Footer Timestamp',
      },
      fieldButtons: {
       'field-name': 'Field Name',
       'field-value': 'Field Value',
       'field-inline': 'Field Inline',
      },
      send: 'Send',
      save: 'Save',
      edit: 'Edit',
      addField: 'Create Field',
      removeField: 'Remove Field',
     },
     modals: {
      string: {
       label: 'Insert a String below, can be empty',
       placeholder: 'Can be empty',
      },
      link: {
       label: 'Insert a Link below, can be empty',
       placeholder: 'Can be empty',
      },
      img: {
       label: 'Insert an Image URL below, can be empty',
       placeholder: 'Can be empty',
      },
      hex: {
       label: 'Insert a Hex Color below',
       placeholder:
        'Can be "random" (will be random every time the Embed is sent), "none", empty or the Name of a Color. Prefix Hex Colors with "#"',
       random: 'random',
      },
      timestamp: {
       label: 'Format: YYYY-MM-DDTHH:mm:ss.sssZ',
       placeholder: 'Can be "now" or empty',
       now: 'now',
      },
     },
     'field-nr': (fieldNr: number) => `Field ${fieldNr}`,
     selectPlaceholder: 'Select a Property to edit',
     fieldPlaceholder: 'Select or create a Field',
     fieldSelection: 'Field Selection:',
    },
    yourEmbed: 'This is your Embed',
    oneRequired: 'At least one of the following Properties is required:',
    embedProperties: {
     title: 'Title',
     description: 'Description',
     fields: '1 Field Name or Value',
     'footer-text': 'Footer Text',
     'author-name': 'Author Name',
    },
    author: `${name} Embed Builder`,
    desc:
     'Use the Buttons below to edit your embed\n\nFor Timestamp help, visit [hammertime.cyou](https://hammertime.cyou/) or [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format)',
    quick: 'Quick Help',
    fields: (cmdId: string) => [
     'This Part is used in Leveling Settings\n`{{msg.author}}` mentions the User that sent the triggering Message\n`{{msg.channel}}` mentions the Channel that the triggering Message was sent in\n`{{msg.guild.name}}` displays the Servers Name\n`{{msg.guild.memberCount}}` displays the Servers Member Count\nhttps://discord.js.org/#/docs/discord.js/main/class/Message',
     'This Part is used in Welcome Settings and Nitro Notifications\n`{{member}}` mentions the User that joined the Server\n`{{member.displayName}}` displays the Name of the joined Member\n`{{member.guild.name}}` displays the Servers Name\n`{{member.guild.memberCount}}` displays the Servers Member Count\nhttps://discord.js.org/#/docs/discord.js/main/class/GuildMember',
     `You can use </stp:${cmdId}> to test the \`{{msg}}\` Templates`,
    ],
    editButtons: [
     {
      'author-name': 'Author Name',
      'author-icon': 'Author Icon URL',
      'author-url': 'Author URL',
      title: 'Title',
      url: 'URL',
     },
     {
      description: 'Description',
      thumbnail: 'Thumbnail',
      image: 'Image',
      color: 'Color',
     },
     {
      'footer-text': 'Footer Text',
      'footer-icon': 'Footer Icon URL',
      'footer-url': 'Footer URL',
     },
    ],
   },
   view: {
    'custom-embeds': {
     notFound: 'Embed not found',
    },
    'from-message': {
     notALink:
      "The provided Link was \n**not a Message Link**,\n**I don't have access to it**,\nor the **Message has no Embeds**\n[Click here if you don't know how to get a Message Link](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-#:~:text=To%20get%20the%20Message%20Link%2C%20click%20on%20the,You%20will%20see%20an%20option%20to%20Copy%20Link.)",
    },
   },
   edit: {
    title: 'Edit a Message',
    label: 'Insert a Message Link',
    edited: 'Message successfully edited',
    noMessageFound: 'Message not found or not within the Server',
    noChannelFound: 'Channel not found or not within the Server',
    view: 'Get me there',
   },
   send: {
    placeholder: 'Select one or more channels',
    sent: 'Embed successfully sent',
   },
   save: {
    title: 'Enter a Name',
    label: 'Choose a Name that relates to this Embed',
    saved: 'Embed successfully saved',
   },
  },
  membercount: {
   author: `${name} Member-Count`,
   field: 'For more in-depth Statistics, try [Statbot](https://statbot.net/)',
  },
  ping: {
   author: `${name} Ping`,
   lastHeartbeat: 'Last Heartbeat',
  },
  emojis: {
   createReason: (user: Discord.User) => `Emoji created by ${ch.constants.standard.user(user)}`,
   deleteReason: (user: Discord.User) => `Emoji deleted by ${ch.constants.standard.user(user)}`,
   editReason: (user: Discord.User) => `Emoji edited by ${ch.constants.standard.user(user)}`,
   created: (e: Discord.GuildEmoji) => `Successfully created ${getEmote(e)}`,
   deleted: (e: Discord.GuildEmoji) => `Successfully deleted ${getEmote(e)}`,
   edited: (e: Discord.GuildEmoji) => `Successfully edited ${getEmote(e)}`,
   explain: 'The Roles listed above can use this Emoji',
   placeholder: 'Select 1 or more Roles',
  },
  invites: {
   inviteNotFound: 'Invite not found',
   deleted: (invite: Discord.Invite) => `${getInvite(invite)}was deleted`,
   created: (invite: Discord.Invite) => `${getInvite(invite)}was created`,
  },
  info: {
   basic: '__Basic Info__',
   stats: '__Statistics__',
   otherInfo: '__Other Info__',
   servers: {
    noneFound: 'No Servers found',
   },
   invite: {
    uses: 'Uses',
    author: `${name} Invite-Info`,
    code: 'Code',
    invalidInvite: 'Invalid Invite',
    unsupportedWebsite: 'Unsupported Website',
   },
   emojis: {
    author: `${name} Emoji-Info`,
    animated: 'Animated',
    uploader: 'Uploader',
    available: 'Available',
    managed: 'Managed',
    roles: 'Roles that can use this Emoji',
   },
   role: {
    author: `${name} Role-Info`,
    position: 'Position',
    membercount: 'Membercount',
    tooManyMembers: 'Too many Members to display',
    noMembers: 'No Members with this Role',
    viewChannelPermissions: 'View Channel Permissions',
   },
   badges: {
    author: `${name} Badge-Info`,
   },
   bot: {
    author: `${name} Info`,
    shards: 'Shards',
    uptime: 'Uptime',
    CPU: 'CPU',
    OS: 'Operating System',
    OSruntime: 'OS Runtime',
    memory: 'Memory',
    free: 'Free',
    total: 'Total',
    base: `Ayako ${
     client.user?.id === ch.mainID ? '' : '(The Base of this Bot)'
    } is a Discord Bot written in [TypeScript](https://www.typescriptlang.org/) using the [Discord.JS Library](https://discord.js.org/)
    
It is currently in Version ${ch.util.makeInlineCode(
     packageJSON.version,
    )} and is under the shepherding of <@318453143476371456> (@Lars_und_so), a Full-Time IT Specialist for Application Development.
View [Credits](https://ayakobot.com/credits) for more Information.
Ayako's complete Source-Code is Open-Source and available on [GitHub](https://github.com/AyakoBot).
For more Information, visit [AyakoBot.com](https://ayakobot.com/).
Ayako also has a [YouTube Channel](https://www.youtube.com/@AyakoBot) with Tutorials.

Humble in her origins, Ayako first came to light on the Discord Server [Animekos](https://discord.gg/animekos) back in 2019.
We owe her success to <@267835618032222209> (@Victoria), who pioneered Ayako's journey on her Server, 
and <@244126983489978368> (@PandaFish), whose proficiency in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) served as a Blueprint for Ayako's creation,`,
   },
   user: {
    authorUser: `${name} User-Info`,
    authorBot: `${name} Bot-Info`,
    userInfo: (user: Discord.User) =>
     `**User:** ${user}\n**Tag:** \`${ch.constants.standard.user(user)}\`\n**Discriminator:** \`${
      user.discriminator
     }\`\n**ID:** \`${user.id}\`\n**Username:** \`${user.username}\`\n**Accent Color:** ${
      user.accentColor ? `\`${user.accentColor}\`/\`${user.hexAccentColor}\`` : None
     }`,
    flags: 'Badges',
    createdAt: 'Created At',
    footer: '⬅️ Accent Color',
    memberAuthorUser: `${name} Member User-Info`,
    memberAuthorBot: `${name} Member Bot-Info`,
    displayName: 'Display Name',
    timeout: 'Timed Out',
    joinedAt: 'Joined At',
    permissions: 'Permissions',
    boosting: 'Boosting',
    boostingSince: 'Boosting Since',
    communicationDisabledUntil: 'Timed out until: ',
    viewRoles: 'View Roles',
    viewBasicPermissions: 'View Basic Permissions',
    viewChannelPermissions: 'View Channel Permissions',
    rolesWithoutSep: 'Roles without Separator',
    botInfo: (res: CT.TopGGResponse<true>) =>
     `\n**__Basic Info:__**\n**Prefix:** \`${res.prefix}\`\n**Server Count:** ${
      res.server_count ?? 'Unknown'
     }\n**Tags:** ${
      res.tags?.map((t) => `\`${t}\``).join(', ') ?? None
     }\n\n**__Links:__**\n**Website:** ${res.website ?? None}\n**Support Server:** ${
      res.support ? `https://discord.gg/${res.support}` : None
     }\n**Invite Link:** [Click to Invite](${res.invite})\n**GitHub:** ${
      res.github ?? 'Unknown'
     }\n\n**__Votes:__**\n**All Time Votes:** ${res.points}\n**This Months Votes:** ${
      res.monthlyPoints
     }`,
    browser: 'Try Opening Profile | Browser',
    desktop: 'Try Opening Profile | Desktop App',
    mobile: 'Try Opening Profile | Mobile',
   },
   server: {
    author: `${name} Server-Info`,
    info: {
     acronym: 'Acronym',
     widgetChannel: 'Widget Channel',
     description: 'Description',
    },
    stats: {
     members: 'Members',
     bots: 'Bots',
     channels: 'Channels',
     roles: 'Roles',
     emojis: 'Emojis',
     autoModRules: 'Auto-Mod-Rules',
     invites: 'Invites',
     vanityUses: 'Vanity Uses',
     stickers: 'Stickers',
     boosters: 'Boosters',
     level: 'Boost Level',
     maximumBitrate: 'Maximum Bitrate',
     maxStageVideoChannelUsers: 'Max. Stage Video Channel Users',
    },
    inviteGuild: `${name} is not Part of this Server, therefore only limited Information is available`,
   },
   channel: {
    author: `${name} Channel-Info`,
    stageInstanceName: 'Stage Instance',
    scheduledEvent: {
     author: `${name} Event-Info`,
     userCount: 'User Count',
    },
   },
  },
  settings: {
   tutorial: 'There are Tutorials available for this Setting',
   authorType: (type: string) => `${name} ${type} Settings`,
   active: 'Active',
   wlchannel: 'Whitelisted Channels',
   blchannel: 'Blacklisted Channels',
   wlrole: 'Whitelisted Roles',
   blrole: 'Blacklisted Roles',
   wluser: 'Whitelisted Users',
   bluser: 'Blacklisted Users',
   create: 'Create',
   delete: 'Delete',
   previous: 'Previous',
   previouslySet: 'Previously set',
   next: 'Next',
   noFields: 'No Settings found, get started by creating some',
   insertHere: 'Insert Value here',
   acceptedValue: 'Accepted Value',
   reactionEditor: {
    desc: (thread: Discord.ThreadChannel) =>
     `Check the Emote-Collector Thread (${thread}) to select an Emote\n\nOnce finished, press the "Detect" Button.\nThe Thread will then self-delete. Click the Button below to return to the update Settings Menu`,
    name: 'Emote-Collector',
   },
   log: {
    desc: (n: string, setting: string) =>
     `${ch.util.makeInlineCode(n)} of Setting ${ch.util.makeInlineCode(setting)} updated`,
    created: (setting: string) => `New ${setting} Setting created`,
    deleted: (setting: string) => `${setting} Setting deleted`,
   },
   categories: {
    // 'appeal-questions': {
    //  name: 'Appeal Questions',
    //  fields: {
    //   // TODO
    //   yes: {
    //    name: 'to',
    //    desc: 'do',
    //   },
    //  },
    // },
    // appealsettings: {
    //  name: 'Appeals',
    //  fields: {
    //   // TODO
    //   yes: {
    //    name: 'to',
    //    desc: 'do',
    //   },
    //  },
    // },
    'shop-items': {
     name: 'Shop-Items',
     command: (cId: string) => `</shop:${cId}>`,
     message: 'Shop-Message',
     fields: {
      roles: {
       name: 'Roles',
       desc: 'Roles that can be bought in the Shop',
      },
      price: {
       name: 'Price',
       desc: 'Price of the Role',
      },
      shoptype: {
       name: 'Shop-Type',
       desc: 'The Type of Shop for this Shop-Item',
      },
      buttonemote: {
       name: 'Button Emote',
       desc: 'Emote of the Buy-Button',
      },
      buttontext: {
       name: 'Button Text',
       desc: 'Text of the Buy-Button',
      },
      msgid: {
       name: 'Shop-Message',
       desc: 'The Message the Buy-Button will be put on',
      },
     },
    },
    shop: {
     name: 'Shop',
     fields: {
      currencyemote: {
       name: 'Currency Emote',
       desc: 'Emote used for to display the Currency',
      },
     },
    },
    'vote-rewards': {
     name: 'Vote Rewards',
     fields: {
      tier: {
       name: 'Tier',
       desc: 'The Reward Tier',
      },
      rewardxp: {
       name: 'Reward XP',
       desc: 'Amount of XP Rewarded',
      },
      rewardxpmultiplier: {
       name: 'Reward XP Multiplier',
       desc:
        'Rewarded Multiplier gathered XP are multiplied with (will be removed when the User can Vote again)',
      },
      rewardcurrency: {
       name: 'Reward Currency',
       desc: 'Amount of Currency rewarded',
      },
      rewardroles: {
       name: 'Reward Roles',
       desc: 'Roles Rewarded (will be removed when the User can Vote again)',
      },
      linkedid,
     },
    },
    'anti-spam': {
     name: 'Anti-Spam',
     fields: {
      action: punishmentAction,
      duration: punishmentDuration,
      deletemessageseconds: punishmentDeleteMessageSeconds,
      msgthreshold: {
       name: 'Message Threshold',
       desc: 'Amount of Messages required before Anti-Spam triggers',
      },
      dupemsgthreshold: {
       name: 'Dupe Message Threshold',
       desc: 'Amount of duplicate Messages required before Anti-Spam triggers',
      },
      timeout: {
       name: 'Message-Remember Time (in Seconds)',
       desc: "Time until a Message doesn't count into the Message Threshold anymore",
      },
      deletespam: {
       name: 'Delete Spam',
       desc: 'Whether to Delete Spammed Messages',
      },
     },
    },
    'anti-virus': {
     name: 'Anti-Virus',
     fields: {
      action: punishmentAction,
      duration: punishmentDuration,
      deletemessageseconds: punishmentDeleteMessageSeconds,
      minimize: {
       name: 'Minimize Timeout (in Seconds)',
       desc: 'Timeout until the Mod-Response is minimized',
      },
      delete: {
       name: 'Delete Timeout',
       desc: 'Timeout until the Mod-Response is deleted',
      },
      minimizetof: {
       name: 'Minimize',
       desc: 'Whether to Minimize the Mod-Response',
      },
      deletetof: {
       name: 'Delete',
       desc: 'Whether to Delete the Mod-Response',
      },
      linklogging: {
       name: 'Log Links',
       desc: 'Whether to Log posted Links',
      },
      linklogchannels: {
       name: 'Links Log-Channels',
       desc: 'Where to Log posted Links',
      },
     },
    },
    'auto-punish': {
     name: 'Auto-Punish',
     fields: {
      deletemessageseconds: {
       name: 'Delete Messages Time-Span',
       desc: 'Time-Span of Messages to Delete (Max. 7 Days)',
      },
      warnamount: {
       name: 'Warns Required',
       desc: 'Amount of Warns required before this Punishment applies',
      },
      punishment: {
       name: 'Punishment',
       desc: 'The Punishment to apply',
      },
      duration: {
       name: 'Duration',
       desc: 'The Duration of the Punishment (only applies to Temporary Punishments)',
      },
      addroles: {
       name: 'Add-Roles',
       desc: 'Roles to Add to the punished User',
      },
      removeroles: {
       name: 'Remove-Roles',
       desc: 'Roles to Remove from the punished User',
      },
     },
    },
    invites: {
     name: 'Invites',
     fields: {
      action: punishmentAction,
      duration: punishmentDuration,
      deletemessageseconds: punishmentDeleteMessageSeconds,
     },
    },
    censor: {
     name: 'Censor',
     fields: {
      repostroles: {
       name: 'Repost-Roles',
       desc: 'Users with one of these Roles will have their censored Message reposted',
      },
      repostrules: {
       name: 'Repost-Rules',
       desc:
        'Rules that will have a censored Message reposted. If none are selected, all Rules will have their censored Message reposted',
      },
     },
    },
    newlines: {
     name: 'Newlines',
     fields: {
      maxnewlines: {
       name: 'Max. Newlines',
       desc: 'Maximum amount of Newlines allowed in a Message',
      },
      action: punishmentAction,
      duration: punishmentDuration,
      deletemessageseconds: punishmentDeleteMessageSeconds,
     },
    },
    'blacklist-rules': {
     name: 'Blacklist Rules',
     keyword: 'Keyword Rule',
     mention: 'Mention Spam Rule',
     spam: 'Spam Rule',
     preset: 'Preset Rule',
     member: 'Member Rule',
     actionsRequired: 'Requires at least 1 Action',
     desc: (mF: number, sF: number, kpF: number, msF: number, kF: number) =>
      `${kF} of 6 Keyword Filters\n${msF} of 1 Mention Spam Filters\n${mF} of 1 Member Filters\n${sF} of 1 Spam Filters\n${kpF} of 1 Preset Filters`,
     fields: {
      keywordFilter: {
       name: 'Keyword Filter',
       desc:
        'The Filtered Keywords, seperate with Comma. For more Info visit https://support.discord.com/hc/en-us/articles/4421269296535-AutoMod-FAQ',
      },
      profanity: {
       desc: 'The Discord provided Profanity Preset',
      },
      sexualContent: {
       desc: 'The Discord provided Sexual-Content Preset',
      },
      slurs: {
       desc: 'The Discord provided Slurs Preset',
      },
      allowList: {
       name: 'Allow List',
       desc: 'Words that are allowed to bypass the Filter, separated by Comma',
      },
      mentionTotalLimit: {
       desc: 'Amount of Mentions allowed in a Message',
      },
      mentionRaidProtection: {
       desc: 'Whether to enable Mention Raid Protection',
      },
      regex: {
       name: 'Regexes',
       desc: 'Rust Regexes to Filter Messages\nhttps://rustexp.lpil.uk/',
      },
      blockMessage: {
       desc: 'Whether to block the sent Message',
      },
      blockInteractions: {
       desc: 'Whether to block Server Interactions (or just the Username update)',
      },
      customMessage: {
       name: 'Custom Message',
       desc:
        'The Message to send when a the Filter is triggered.\nDoes not accept Mentions, Markdown or Emojis',
      },
      sendAlertMessage: {
       desc: 'Whether to send an Alert when the Filter is triggered',
      },
      alertChannel: {
       desc: 'The Channel to send the Alert to',
      },
      timeoutDuration: {
       name: 'Timeout Duration',
       desc: 'The Duration of the Timeout (Example: 1h 5 minutes 30 s)\nMaximum of 4 Weeks',
      },
      exemptChannels: {
       name: 'Exempt Channels',
       desc: 'Channels that are excluded from the Filter',
      },
      exemptRoles: {
       name: 'Exempt Roles',
       desc: 'Roles that are excluded from the Filter',
      },
     },
    },
    expiry: {
     desc: (cmdId: string) =>
      `⚠️ Note: ⚠️\nAll of these Settings are ${name}-Internal!\nExample: Setting Bans to expire after 5 Months will not lead to an Auto-Unban after 5 Months, the entry will just be deleted from Commands like </check:${cmdId}>`,
     name: 'Expiry',
     fields: {
      bans: {
       name: 'Bans',
       desc: 'Whether Bans expire or not',
      },
      channelbans: {
       name: 'Channel-Bans',
       desc: 'Whether Channel-Bans expire or not',
      },
      kicks: {
       name: 'Kicks',
       desc: 'Whether Kicks expire or not',
      },
      mutes: {
       name: 'Mutes',
       desc: 'Whether Mutes expire or not',
      },
      warns: {
       name: 'Warns',
       desc: 'Whether Warns expire or not',
      },
      banstime: {
       name: 'Bans-Expire Time',
       desc: 'Time before Bans expire',
      },
      channelbanstime: {
       name: 'Channel-Bans-Expire Time',
       desc: 'Time before Channel-Bans expire',
      },
      kickstime: {
       name: 'Kicks-Expire Time',
       desc: 'Time before Kicks expire',
      },
      mutestime: {
       name: 'Mutes-Expire Time',
       desc: 'Time before Mutes expire',
      },
      warnstime: {
       name: 'Warns-Expire Time',
       desc: 'Time before Warns expire',
      },
     },
    },
    'role-rewards': {
     name: 'Reward-Roles',
     desc:
      "No matter how many Custom-Roles a User qualifies for, they can only ever create 1 Custom-Role\nHowever if they qualify for multiple Custom-Roles and one of them allows them to set an Icon and/or Color while the other doesn't, they will be able to set an Icon and/or Color",
     fields: {
      cansetcolor: {
       name: 'Can set Color',
       desc: 'Whether Users can set the Color of their Custom-Roles',
      },
      canseticon: {
       name: 'Can set Icon',
       desc: 'Whether Users can set the Icon of their Custom-Roles',
      },
      roles: {
       name: 'Roles',
       desc: 'The Roles that allow the Users to be rewarded',
      },
      customrole: {
       name: 'Custom Role',
       desc: 'Whether Users can create their own Roles or not',
      },
      xpmultiplier: multiplier,
      currency: {
       name: 'Currency Reward',
       desc: 'Amount of Currency rewarded',
      },
      positionrole: {
       name: 'Position Role',
       desc: 'The Role under which the Custom-Roles will be created',
      },
     },
    },
    'auto-roles': {
     name: 'Auto-Roles',
     fields: {
      botroleid: {
       name: 'Bot Role',
       desc: 'Roles added to joining Bots',
      },
      userroleid: {
       name: 'User Role',
       desc: 'Roles added to joining Users',
      },
      allroleid: {
       name: 'All Role',
       desc: 'Roles added to joining Accounts (Bots and Users)',
      },
     },
    },
    cooldowns: {
     name: 'Cooldowns',
     fields: {
      command: {
       name: 'Command',
       desc: 'The Command that triggers the Cooldown',
      },
      cooldown: {
       name: 'Cooldown',
       desc: 'The Cooldown duration applied to the Command',
      },
      activechannelid: {
       name: 'Active Channels',
       desc: 'The Channels in which this Cooldown applies',
      },
     },
    },
    'disboard-reminders': {
     name: 'Disboard-Reminders',
     fields: {
      channelid: {
       name: 'Channel',
       desc: 'The Channel to send BUMP Reminders in',
      },
      repeatreminder: {
       name: 'Repeat-Reminder Timeout',
       desc: 'If no-one has bumped another Reminder will be sent after this Timeout',
      },
      roles: {
       name: 'Ping Roles',
       desc: 'Roles to Ping with the BUMP Reminder',
      },
      users: {
       name: 'Ping Users',
       desc: 'Users to Ping with the BUMP Reminder',
      },
      deletereply: {
       name: 'Delete Reply',
       desc: 'Whether to delete the BUMP Command Reply',
      },
      repeatenabled: {
       name: 'Repeat Reminder',
       desc: 'Whether to send a Repeating Reminder if no one has Bumped',
      },
     },
    },
    'self-roles': {
     name: 'Self-Roles',
     fields: {
      roles: {
       name: 'Roles',
       desc: 'The Roles that are Self-Assignable',
      },
      onlyone: {
       name: 'Only One assignable',
       desc: 'Whether only one of the Roles should be Self-Assignable',
      },
      name: {
       name: 'Name',
       desc: 'The Name of the Role Category',
      },
     },
    },
    separators: {
     name: 'Role-Separators',
     oneTimeRunner: {
      name: 'Apply ALL Separators to EVERY Member of your Server',
      description: 'Can only be run if the previous Process is finished.',
      cant: "You don't have any Separators set, so you can't uset his function",
      timeout: 'The Operation timed out, please contact Support\nhttps://support.ayakobot.com',
      recommended:
       'Are you sure you want to run this Function?\nThis can only be run if the previous Process is finished',
      stats: (roles: number, members: number, finishTime: string) =>
       `Adding and Removing \`${roles}\` Roles from \`${members}\` Server Members\nThis Process may take until ${finishTime}.\n\nThis Embed will be updated every Hour (+ Calculation delay depending on the size of your Server)`,
      answers: '`Yes` or `No`',
      stillrunning: 'The last initiated Process is still running',
      finished: 'Process finished, all Roles should be up to Date',
     },
     fields: {
      separator: {
       name: 'Separator Role',
       desc: 'The Role that Separates Roles that belong to its Category from other Roles',
      },
      stoprole: {
       name: 'Stop Role',
       desc: 'The Role that marks the end of a Roles Category',
      },
      isvarying: {
       name: 'Dynamic Roles',
       desc: 'Whether to use Dynamic Role Categories or Strictly Defined ones',
      },
      roles: {
       name: 'Roles',
       desc: 'The Roles that belong to this Role Category',
      },
     },
    },
    sticky: {
     name: 'Sticky',
     unsticky: 'These Roles will __not__ be sticky',
     sticky: 'These Roles will be sticky',
     fields: {
      roles: {
       name: 'Roles',
       desc: 'Roles that will or will not be sticky, depending on the Sticky-Roles Mode',
      },
      stickyrolesmode: {
       name: 'Roles Mode',
       desc: 'Whether defined Roles are sticky or not sticky',
      },
      stickyrolesactive: {
       name: 'Sticky-Roles',
       desc: 'Whether Sticky-Roles is active or not',
      },
      stickypermsactive: {
       name: 'Sticky-Channel-Perms',
       desc: 'Whether Sticky-Channel-Perms is active or not',
      },
     },
    },
    suggestions: {
     name: 'Suggestions',
     fields: {
      deletedenied: {
       name: 'Delete Denied Suggestions',
       desc: 'Whether to delete denied Suggestions',
      },
      deleteapproved: {
       name: 'Delete Approved Suggestions',
       desc: 'Whether to delete approved Suggestions',
      },
      deletedeniedafter: {
       name: 'Delete Denied Suggestions after',
       desc: 'How long to wait before deleting denied Suggestions',
      },
      deleteapprovedafter: {
       name: 'Delete Approved Suggestions after',
       desc: 'How long to wait before deleting approved Suggestions',
      },
      channelid: {
       name: 'Suggestion Channel',
       desc: 'The Channel to post Suggestions in',
      },
      novoteroles: {
       name: 'Vote-Banned Roles',
       desc: 'Roles banned from Voting on Suggestions',
      },
      novoteusers: {
       name: 'Vote-Banned Users',
       desc: 'User banned from Voting on Suggestions',
      },
      approverroleid: {
       name: 'Approver Roles',
       desc: 'Roles that can Approve or Deny Suggestions',
      },
      anonvote: {
       name: 'Anonymous Votes',
       desc: 'Whether Votes are Anonymous or not',
      },
      anonsuggestion: {
       name: 'Anonymous Suggestions',
       desc: 'Whether Suggestions are Anonymous or not',
      },
      nosendroles: {
       name: 'Suggest-Banned Roles',
       desc: 'Roles banned from sending Suggestions',
      },
      nosendusers: {
       name: 'Suggest-Banned Users',
       desc: 'Users banned from sending Suggestions',
      },
      pingroleid: {
       name: 'Suggest-Banned Users',
       desc: 'The Roles to ping when a new Suggestion is sent',
      },
      pinguserid: {
       name: 'Suggest-Banned Users',
       desc: 'The User to ping when a new Suggestion is sent',
      },
     },
    },
    logs: {
     name: 'Log Channels',
     fields: {
      applicationevents: {
       name: 'Application Events',
       desc: 'The Channel to send Application Events in',
      },
      automodevents: {
       name: 'AutoMod Events',
       desc: 'The Channel to send AutoMod Events in',
      },
      channelevents: {
       name: 'Channel Events',
       desc: 'The Channel to send Channel Events in',
      },
      emojievents: {
       name: 'Emoji Events',
       desc: 'The Channel to send Emoji Events in',
      },
      guildevents: {
       name: 'Guild Events',
       desc: 'The Channel to send Guild Events in',
      },
      scheduledeventevents: {
       name: 'Scheduled Event Events',
       desc: 'The Channel to send Scheduled Event Events in',
      },
      inviteevents: {
       name: 'Invite Events',
       desc: 'The Channel to send Invite Events in',
      },
      messageevents: {
       name: 'Message Events',
       desc: 'The Channel to send Message Events in',
      },
      roleevents: {
       name: 'Role Events',
       desc: 'The Channel to send Role Events in',
      },
      stageevents: {
       name: 'Stage Events',
       desc: 'The Channel to send Stage Events in',
      },
      stickerevents: {
       name: 'Sticker Events',
       desc: 'The Channel to send Sticker Events in',
      },
      typingevents: {
       name: 'Typing Events',
       desc: 'The Channel to send Typing Events in',
      },
      userevents: {
       name: 'User Events',
       desc: 'The Channel to send User Events in',
      },
      voiceevents: {
       name: 'Voice Events',
       desc: 'The Channel to send Voice Events in',
      },
      webhookevents: {
       name: 'Webhook Events',
       desc: 'The Channel to send Webhook Events in',
      },
      settingslog: {
       name: 'Settings Log',
       desc: 'The Channel to send Settings Logs in',
      },
      modlog: {
       name: 'Mod Log',
       desc: 'The Channel to send Mod Logs in',
      },
      reactionevents: {
       name: 'Reaction Events',
       desc: 'The Channel to send Reaction Events in',
      },
      memberevents: {
       name: 'Member Events',
       desc: 'The Channel to send Member Events in',
      },
     },
    },
    verification: {
     name: 'Verification',
     fields: {
      logchannel: {
       name: 'Log Channel',
       desc: 'The Channel to send Verification Logs in',
      },
      finishedrole: {
       name: 'Verified Role',
       desc: 'The Role assigned to Members after finishing Verification',
      },
      pendingrole: {
       name: 'Pending Role',
       desc: 'The Role assigned to Members before finishing Verification',
      },
      startchannel: {
       name: 'Start Channel',
       desc: 'The Channel joining Members can start the Verification in',
      },
      selfstart: {
       name: 'Self-Start',
       desc: 'Whether Verification should start itself or not',
      },
      kickafter: {
       name: 'Kick Timeout',
       desc: 'How long to wait before unverified Members are kicked from the Server',
      },
      kicktof: {
       name: 'Kick',
       desc: 'Whether to Kick unverified Members or not',
      },
     },
    },
    welcome: {
     name: 'Welcome',
     fields: {
      channelid: {
       name: 'Welcome Channel',
       desc: 'The Channel to welcome joining Members in',
      },
      embed: {
       name: 'Welcome Embed',
       desc: `The Welcome Embed to use\nYou can create one using </embed-builder create:0>`,
      },
      pingroles: {
       name: 'Ping Roles',
       desc: 'The Roles to Ping when a Member is welcomed',
      },
      pingusers: {
       name: 'Ping Users',
       desc: 'The Users to Ping when a Member is welcomed',
      },
      pingjoin: {
       name: 'Ping joined User',
       desc: 'Whether to Ping the joining Member or not',
      },
     },
    },
    vote: {
     name: 'Vote',
     desc:
      'Announce Votes for your Server or Bot on Top.gg\nVisit your Servers/Bots Page, click `Edit`, then enter the `Webhooks` Page\nCopy `https://api.ayakobot.com/topggvotes` into the `Webhook URL` Text-Box and the Auto-Generated `Token` from below into the `Authorization` Text-Box',
     linkedId: 'Linked ID',
     fields: {
      token: {
       name: 'Token',
       desc: 'The Authentication Token used by Top.gg',
      },
      reminders: {
       name: 'Reminder',
       desc: 'Whether to Remind Voters to Vote again',
      },
      announcementchannel: {
       name: 'Announcement Channel',
       desc: 'The Channel to announce Votes in',
      },
     },
    },
    leveling: {
     name: 'Leveling',
     messages: 'Messages',
     reactions: 'Reactions',
     silent: 'Silent',
     fields: {
      xppermsg: {
       name: 'XP per Message',
       desc: 'Amount of XP awarded per Member',
      },
      xpmultiplier: multiplier,
      rolemode: {
       name: 'Role Mode',
       desc: 'Whether to Stack or Replace Level-Roles',
      },
      lvlupmode: {
       name: 'Level-up Mode',
       desc: 'The Type of Level-up Notification Method',
      },
      lvlupemotes: {
       name: 'Level-up Emotes',
       desc: 'The Emotes I will react with to Messages that triggered a Level-up',
      },
      lvlupdeltimeout: {
       name: 'Level-up Deletion Timeout',
       desc: 'The Timeout before the Level-up Message is Auto-Deleted',
      },
      embed: {
       name: 'Level-up Embed',
       desc: 'The Embed sent in the Level-up Message',
      },
      lvlupchannels: {
       name: 'Level-up Channels',
       desc: 'The Channel to send the Level-up Message in',
      },
      ignoreprefixes: {
       name: 'Ignore Prefixes',
       desc: 'Whether to Ignore Prefixed Messages or not',
      },
      prefixes: {
       name: 'Prefixes',
       desc: 'The Prefixes that will tell if the Message should be ignored',
      },
      minwords: {
       name: 'Minimum Amount of Words',
       desc: 'The Minimum Amount of Words required to award XP (measured by Spaces)',
      },
     },
    },
    'multi-channels': {
     name: 'Leveling Multi-Channels',
     fields: {
      channels: {
       name: 'Channels',
       desc: 'The Channels in which this Multiplier applies',
      },
      multiplier,
     },
    },
    'multi-roles': {
     name: 'Leveling Multi-Channels',
     fields: {
      roles: {
       name: 'Roles',
       desc: 'The Roles that will have a Multiplier applied',
      },
      multiplier,
     },
    },
    'level-roles': {
     name: 'Level-Roles',
     fields: {
      roles: {
       name: 'Roles',
       desc: 'The Roles applied when a Member achieves a Level',
      },
      level: {
       name: 'Level',
       desc: 'The Level required to gain the Roles',
      },
     },
    },
    'rule-channels': {
     name: 'Leveling Rules-Channels',
     amount: 'Amount',
     fields: {
      rules: {
       name: 'Rules',
       desc: 'The Rules that apply to this Channels XP Rewards',
      },
      channels: {
       name: 'Channels',
       desc: 'The Channels these Rules apply in',
      },
      hasleastattachments: {
       name: 'Minimum Amount of Attachments',
       desc: 'The minimum Amount of Attachments required for this Message to gain XP',
      },
      hasmostattachments: {
       name: 'Maximum Amount of Attachments',
       desc: 'The maximum Amount of Attachments required for this Message to gain XP',
      },
      hasleastcharacters: {
       name: 'Minimum Amount of Characters in Content',
       desc: 'The minimum Amount of Characters required for this Message to gain XP',
      },
      hasmostcharacters: {
       name: 'Maximum Amount of Characters in Content',
       desc: 'The maximum Amount of Characters required for this Message to gain XP',
      },
      hasleastwords: {
       name: 'Minimum Amount of Words in Content',
       desc: 'The minimum Amount of Words required for this Message to gain XP',
      },
      hasmostwords: {
       name: 'Maximum Amount of Words in Content',
       desc: 'The maximum Amount of Words required for this Message to gain XP',
      },
      mentionsleastusers: {
       name: 'Minimum Amount of User Mentions in Content',
       desc: 'The minimum Amount of mentioned Users required for this Message to gain XP',
      },
      mentionsmostusers: {
       name: 'Maximum Amount of User Mentions in Content',
       desc: 'The maximum Amount of mentioned Users required for this Message to gain XP',
      },
      mentionsleastchannels: {
       name: 'Minimum Amount of Channels Mentions in Content',
       desc: 'The minimum Amount of mentioned Channels required for this Message to gain XP',
      },
      mentionsmostchannels: {
       name: 'Maximum Amount of Channels Mentions in Content',
       desc: 'The maximum Amount of mentioned Channels required for this Message to gain XP',
      },
      mentionsleastroles: {
       name: 'Minimum Amount of Roles Mentions in Content',
       desc: 'The minimum Amount of mentioned Roles required for this Message to gain XP',
      },
      mentionsmostroles: {
       name: 'Maximum Amount of Roles Mentions in Content',
       desc: 'The maximum Amount of mentioned Roles required for this Message to gain XP',
      },
      hasleastlinks: {
       name: 'Minimum Amount of Links',
       desc: 'The minimum Amount of Links required for this Message to gain XP',
      },
      hasmostlinks: {
       name: 'Maximum Amount of Links',
       desc: 'The maximum Amount of Links required for this Message to gain XP',
      },
      hasleastemotes: {
       name: 'Minimum Amount of Emotes',
       desc: 'The minimum Amount of Emotes required for this Message to gain XP',
      },
      hasmostemotes: {
       name: 'Maximum Amount of Emotes',
       desc: 'The maximum Amount of Emotes required for this Message to gain XP',
      },
      hasleastmentions: {
       name: 'Minimum Amount of Mentions',
       desc: 'The minimum Amount of Mentions required for this Message to gain XP',
      },
      hasmostmentions: {
       name: 'Maximum Amount of Mentions',
       desc: 'The maximum Amount of Mentions required for this Message to gain XP',
      },
     },
    },
    nitro: {
     name: 'Nitro-Monitoring',
     fields: {
      logchannels: {
       name: 'Log-Channels',
       desc: 'The Channels in which to Log when Members start or stop boosting and more',
      },
      rolemode: {
       name: 'Role-Mode',
       desc: 'Whether to Stack or Replace Booster-Roles',
      },
      notification: {
       name: 'Boost-Notification',
       desc: 'Whether to send a seperate Boost-Notification',
      },
      notifchannels: {
       name: 'Notification-Channels',
       desc: 'The Channels to send the Boost-Notification in',
      },
      notifembed: {
       name: 'Notification-Embed',
       desc: 'The Embed to send when a Member boosts the Server',
      },
     },
    },
    'button-role-settings': {
     name: 'Button Settings',
     fields: {
      msgid: {
       name: 'Message',
       desc:
        'The Message Link of the Message these Settings apply to\nThe Message MUST be sent by me',
      },
      onlyone: {
       name: 'Only One',
       desc: 'Whether only one Role can be taken',
      },
      anyroles: {
       name: 'Any Roles',
       desc: 'Roles given to the Member once any of the Roles were taken',
      },
     },
    },
    'reaction-role-settings': {
     desc: 'Use the `Active` Button to refresh the Message-Reactions',
     name: 'Reaction Settings',
     fields: {
      msgid: {
       name: 'Message',
       desc: 'The Message Link of the Message these Settings apply to',
      },
      anyroles: {
       name: 'Any Roles',
       desc: 'Roles given to the Member once any of the Roles were taken',
      },
     },
    },
    'reaction-roles': {
     desc:
      'Use the `Active` Button in the linked Reaction-Role-Settings to refresh the Message-Reactions',
     name: 'Reaction Roles',
     fields: {
      emote: {
       name: 'Emote',
       desc:
        'The Emote of this Reaction\nPlease only send the Emote here\n\nOnce done, click on "Detect" below, then return to the previous Message or call the Settings Menu again.',
      },
      roles: {
       name: 'Roles',
       desc: 'The Roles given to the Member once reacted',
      },
      linkedid,
     },
    },
    'button-roles': {
     name: 'Button Roles',
     fields: {
      emote: {
       name: 'Emote',
       desc:
        'The Emote of this Button\nPlease only send the Emote here\n\nOnce done, click on "Detect" below, then return to the previous Message or call the Settings Menu again.',
      },
      text: {
       name: 'Text',
       desc: 'The Text of this Button',
      },
      roles: {
       name: 'Roles',
       desc: 'The Roles given to the Member once reacted',
      },
      linkedid,
     },
    },
    basic: {
     name: 'Basic',
     tokenSetDesc: `**It appears you have a custom Bot-Token set**
     If you want to get rid of double Slash-Commands, remove ${name} from your Server and Invite her back [using this Invite Link](${ch.constants.standard.invite.replace(
      '%20applications.commands',
      '',
     )})
     __${name} is required to run Custom-Bots__`,
     fields: {
      prefix: {
       name: 'Prefix',
       desc: `The Prefix ${name} should listen to`,
      },
      interactionsmode: {
       name: 'RP-Command Size',
       desc: 'Whether RP-Commands should be large or small',
      },
      legacyrp: {
       name: 'Legacy RP-Commands',
       desc: 'Whether to use Legacy RP-Commands',
      },
      editrpcommands: {
       name: 'Edit RP-Commands',
       desc: 'Whether to use Edit or Repost RP-Commands upon replying',
      },
      lan: {
       name: 'Language',
       desc: `The Language ${name} displays in`,
      },
      errorchannel: {
       name: 'Error Channel',
       desc: 'The Channel to post Error Messages in',
      },
      ptreminderenabled: {
       name: 'Privacy & Terms Reminder',
       desc: 'Whethr the Privacy and Terms Reminder is enabled or not',
      },
      token: {
       name: 'Token',
       desc: `The Token of your Custom Bot
Obtain it on the [Discord's Developer Portal](https://discordapp.com/developers/applications/)

__Please make sure you do the following AFTER you set your Token here__:\n- insert \`https://api.ayakobot.com/interactions\` as your Bots \`Interactions Endpoint URL\` under the \`General Information\` Section\n- enable the \`Public Bot\` Switch under the \`Bot\` Section\n- enable the \`Message Content\` and \`Guild Member\` \`Privileged Gateway Intents\` under the \`Bot\` Section\n- invite your Bot to your Server using the provided Invite URL\n
__Notice__
If you are removing the Token from this Field and previously re-invited ${name} with the Link that removes her Slash-Commands, 
you will have to re-invite her using [this Invite Link](${ch.constants.standard.invite})`,
      },
     },
    },
    'booster-roles': {
     name: 'Nitro Roles',
     fields: {
      roles: {
       name: 'Roles',
       desc: 'The Roles applied when a Member achieves a Level',
      },
      days: {
       name: 'Days',
       desc: 'The Days required to gain the Roles',
      },
     },
    },
   },
  },
  giveaway: {
   notFoundOrEnded: 'Giveaway not found or already ended',
   notFound: 'Giveaway not found',
   list: {
    noGiveaways: 'No Giveaways found',
    end: 'End',
    winnercount: 'Winner Count',
    claimingdone: 'Claiming done',
    notEnabled: 'Not enabled',
    host: 'Host',
    reqrole: 'Required Role',
    collecttime: 'Collect Timeout',
    failreroll: 'Re-roll if not collected',
    prize: 'Prize',
   },
   create: {
    collectTimeTooShort:
     'The Collect Timeout is too short, should be longer than or equal to  1 Hour',
    description: 'Create a Giveaway',
    missingPermissions: "I can't send or view Messages in this Channel",
    invalidTime: 'The provided Time was invalid',
    author: `${name} Giveaways`,
    participants: 'Participants',
    winners: (n: number) => `Possible Winners: ${n}`,
    end: (e: string) => `End: ${e}`,
    host: (u: Discord.User) => `Giveaway Host: ${ch.constants.standard.user(u)}`,
    roleRequire: 'Required Role to enter this Giveaway',
    participate: 'Participate',
    sent: (channel: Discord.Channel) => `Giveaway started in ${channel}`,
    error: 'Failed to create Giveaway',
   },
   end: {
    ended: 'Ended',
    winner: 'Winner',
    winners: 'Winners',
    title: 'Congratulations! You won a Giveaway!',
    trouble: 'If you have trouble with your Giveaway, DM or Mention the User below',
    dmUser: 'To get your Prize, DM or Mention the User below',
    noValidEntries: 'No valid Entries | No Winner picked',
    button: 'Go to Giveaway',
    manuallyEnded: 'Manually Ended Giveaway',
    clickButton: 'Go to the Giveaway and click `Claim` to claim your Prize',
    limitedTime: (inTime: string, t: string) => `Your prize expires ${inTime} (${t})`,
    timeRanOut:
     'You can no longer claim your Prize since you took too long to claim it\nI will now re-roll the Giveaway',
    until: (t: string) => `Your Prize expires ${t}`,
    claim: 'Claim',
    claimingdone: 'Everyone claimed',
    expired: 'Claiming expired',
   },
   claim: {
    notWinner: 'You are not a Winner of this Giveaway',
   },
   participate: {
    cantEnter: "You don't meet the Requirements to participate in this Giveaway",
    entered: 'You are now participating in this Giveaway',
    left: 'You are no longer participating in this Giveaway',
    participants: (n: number) => `${n} Participants`,
    notFound: 'Either the Giveaway ended or it was deleted',
   },
   edit: {
    description: 'Edit a Giveaway',
    invalidTime: 'The given Time was not valid',
    noChanges: 'No valid Changes were made',
    success: 'Successfully edited Giveaway',
    button: 'Get to Giveaway',
    noOptionsProvided: 'Please provide Options to change',
   },
   reroll: {
    description: 'Re-roll a Giveaway',
    rerolled: 'Successfully re-rolled Giveaway',
    button: 'Get to Giveaway',
   },
   cancel: {
    cancelled: 'Giveaway Cancelled',
   },
  },
 },
 nitro: {
  given: (user: Discord.User, roles: string, days: Strumber) =>
   `<@${user.id}> has been given\n${roles}\nfor boosting ${days} Days`,
  taken: (user: Discord.User, roles: string) => `<@${user.id}> has been taken\n${roles}\nfrom`,
 },
 autotypes: {
  shop: `${name} Shop`,
  antispam: `${name} Anti-Spam`,
  antivirus: `${name} Anti-Virus`,
  blacklist: `${name} Blacklist`,
  statschannel: `${name} Stats-Channel`,
  separators: `${name} Separators`,
  autopunish: `${name} Auto-Punish`,
  selfroles: `${name} Self-Roles`,
  nitro: `${name} Nitro-Monitoring`,
  autoroles: `${name} Auto-Roles`,
  stickyroles: `${name} Sticky-Roles`,
  stickyperms: `${name} Sticky-Channel-Perms`,
  reactionroles: `${name} Reaction-Roles`,
  buttonroles: `${name} Button-Roles`,
 },
 mod: {
  warning: {
   text:
    'You just issued a **Moderation Command** on a User with a **Mod Role**.\nAre you sure you want to **proceed**!',
   proceed: 'Proceed',
  },
  appeal: `Appeal`,
  logs: {
   strikeAdd: {
    author: 'Member striked',
    description: (target: Discord.User, executor: Discord.User) =>
     `${getUser(target)}was striked by\n${getUser(executor)}`,
   },
   roleAdd: {
    author: 'Role given to Member',
    description: (
     target: Discord.User,
     executor: Discord.User,
     options: CT.ModOptions<'roleAdd'>,
    ) =>
     `${options.roles.map((r) => getRole(r)).join('')}${
      options.roles.length > 1 ? 'were' : 'was'
     } given to\n${getUser(target)}by\n${getUser(executor)}`,
   },
   roleRemove: {
    author: 'Role removed from Member',
    description: (
     target: Discord.User,
     executor: Discord.User,
     options: CT.ModOptions<'roleRemove'>,
    ) =>
     `${options.roles.map((r) => getRole(r)).join('')}${
      options.roles.length > 1 ? 'were' : 'was'
     } removed from\n${getUser(target)}by\n${getUser(executor)}`,
   },
   tempMuteAdd: {
    author: 'Member Muted',
    description: (
     target: Discord.User,
     executor: Discord.User,
     options: CT.ModOptions<'tempMuteAdd'>,
    ) =>
     `${getUser(target)}was Muted by\n${getUser(executor)}until\n${ch.constants.standard.getTime(
      options.duration * 1000,
     )}`,
   },
   muteRemove: {
    author: 'Member Un-Muted',
    description: (target: Discord.User, executor: Discord.User) =>
     `${getUser(target)}was Un-Muted by\n${getUser(executor)}`,
   },
   unAfk: {
    author: 'Member AFK-Status removed',
    description: (target: Discord.User, executor: Discord.User) =>
     `AFK-Status of\n${getUser(target)}was removed by\n${getUser(executor)}`,
   },
   banAdd: {
    author: 'User Banned',
    description: (target: Discord.User, executor: Discord.User) =>
     `${getUser(target)}was Banned by\n${getUser(executor)}`,
   },
   softBanAdd: {
    author: 'User Soft-Banned',
    description: (target: Discord.User, executor: Discord.User) =>
     `${getUser(target)}was soft-Banned by\n${getUser(executor)}`,
   },
   tempBanAdd: {
    author: 'User Temp-Banned',
    description: (
     target: Discord.User,
     executor: Discord.User,
     options: CT.ModOptions<'tempBanAdd'>,
    ) =>
     `${getUser(target)}was Temp-Banned by\n${getUser(
      executor,
     )}until\n${ch.constants.standard.getTime(options.duration * 1000)}`,
   },
   channelBanAdd: {
    author: 'Member Channel-Banned',
    description: (
     target: Discord.User,
     executor: Discord.User,
     options: CT.ModOptions<'channelBanAdd'>,
    ) =>
     `${getUser(target)}was Channel-Banned by\n${getUser(executor)}from\n${getChannel(
      options.channel,
     )}`,
   },
   tempChannelBanAdd: {
    author: 'Member Temp-Channel-Banned',
    description: (
     target: Discord.User,
     executor: Discord.User,
     options: CT.ModOptions<'tempChannelBanAdd'>,
    ) =>
     `${getUser(target)}was Temp-Channel-Banned by\n${getUser(executor)}from\n${getChannel(
      options.channel,
     )}until\n${ch.constants.standard.getTime(options.duration * 1000)}`,
   },
   channelBanRemove: {
    author: 'Member Channel-Un-Banned',
    description: (
     target: Discord.User,
     executor: Discord.User,
     options: CT.ModOptions<'channelBanRemove'>,
    ) =>
     `${getUser(target)}was Channel-Un-Banned by\n${getUser(executor)}from\n${getChannel(
      options.channel,
     )}`,
   },
   banRemove: {
    author: 'User Un-Banned',
    description: (target: Discord.User, executor: Discord.User) =>
     `${getUser(target)}was Un-Banned by\n${getUser(executor)}`,
   },
   kickAdd: {
    author: 'Member Kicked',
    description: (target: Discord.User, executor: Discord.User) =>
     `${getUser(target)}was Kicked by\n${getUser(executor)}`,
   },
   warnAdd: {
    author: 'User Warned',
    description: (target: Discord.User, executor: Discord.User) =>
     `${getUser(target)}was Warned by\n${getUser(executor)}`,
   },
   softWarnAdd: {
    author: 'User Soft-Warned',
    description: (target: Discord.User, executor: Discord.User) =>
     `${getUser(target)}was Soft-Warned by\n${getUser(executor)}`,
   },
  },
  alreadyExecuting: 'There currently is a Moderation-Command being executed on this User',
  execution: {
   strikeAdd: {
    dm: () => `You have been Striked`,
    meNoPerms: "I can't Strike this User",
    youNoPerms: "You can't Strike this User",
    error: 'I failed to Strike this User',
    alreadyApplied: (target: Discord.User) => `${getUser(target)}isn't Striked`,
    success: (target: Discord.User) => `${getUser(target)}was Striked`,
    loading: 'Striking User...',
    self: "You can't Strike yourself",
    me: "I won't Strike myself",
   },
   roleAdd: {
    dm: (options: CT.ModOptions<'roleAdd'>) =>
     `${options.roles.join(', ')} ${
      options.roles.length > 1 ? 'have' : 'has'
     } been added to your Roles`,
    meNoPerms: "I can't add Roles to this User",
    youNoPerms: "You can't add Roles to this User",
    error: 'I failed to add these Roles to the User',
    alreadyApplied: (target: Discord.User) => `${getUser(target)}already has these Roles`,
    success: (target: Discord.User, options: CT.ModOptions<'roleAdd'>) =>
     `${options.roles.join(', ')} ${options.roles.length > 1 ? 'were' : 'was'} added to ${target}`,
    loading: 'Adding Role to User...',
    self: "You can't add Roles to yourself",
    me: "I won't add Roles to myself",
   },
   roleRemove: {
    dm: (options: CT.ModOptions<'roleRemove'>) =>
     `${options.roles.join(', ')} ${
      options.roles.length > 1 ? 'have' : 'has'
     } been removed from your Roles`,
    meNoPerms: "I can't remove Roles from this User",
    youNoPerms: "You can't remove Roles from this User",
    error: 'I failed to remove these Roles from the User',
    alreadyApplied: (target: Discord.User) => `${getUser(target)}doesn't have that Role`,
    success: (target: Discord.User, options: CT.ModOptions<'roleRemove'>) =>
     `${options.roles.join(', ')} ${
      options.roles.length > 1 ? 'were' : 'was'
     } removed from ${target}`,
    loading: 'Removing Role from User...',
    self: "You can't remove Roles from yourself",
    me: "I won't remove Roles from myself",
   },
   tempMuteAdd: {
    dm: () => `You have been Muted`,
    meNoPerms: "I can't Mute this User",
    youNoPerms: "You can't Mute this User",
    error: 'I failed to Mute this User',
    alreadyApplied: (target: Discord.User) => `${getUser(target)}is already Muted`,
    success: (target: Discord.User) => `${getUser(target)}was Muted`,
    loading: 'Muting User...',
    self: "You can't Mute yourself",
    me: "I won't Mute myself",
    durationTooLong: 'Duration cannot be longer than 28 Days',
   },
   muteRemove: {
    dm: () => `You have been Un-Muted`,
    meNoPerms: "I can't Un-Mute this User",
    youNoPerms: "You can't Un-Mute this User",
    error: 'I failed to Un-Mute this User',
    alreadyApplied: (target: Discord.User) => `${getUser(target)}isn't Muted`,
    success: (target: Discord.User) => `${getUser(target)}was Un-Muted`,
    loading: 'Un-Muting User...',
    self: "You can't Un-Mute yourself",
    me: "I won't Un-Mute myself",
    reason: 'Mute ended',
   },
   banAdd: {
    dm: (options: CT.ModOptions<'banAdd'>) => `You have been Banned from ${options.guild.name}`,
    meNoPerms: "I can't Ban this User",
    youNoPerms: "You can't Ban this User",
    error: 'I failed to Ban this User',
    alreadyApplied: (target: Discord.User) => `${getUser(target)}is already Banned`,
    success: (target: Discord.User) => `${getUser(target)}was Banned`,
    loading: 'Banning User...',
    self: "You can't Ban yourself",
    me: "I won't Ban myself",
   },
   softBanAdd: {
    dm: (options: CT.ModOptions<'softBanAdd'>) =>
     `You have been Soft-Banned from ${options.guild.name}`,
    meNoPerms: "I can't Soft-Ban this User",
    youNoPerms: "You can't Soft-Ban this User",
    error: 'I failed to Soft-Ban this User',
    alreadyApplied: (target: Discord.User) => `${getUser(target)}is already Soft-Banned`,
    success: (target: Discord.User) => `${getUser(target)}was Soft-Banned`,
    loading: 'Soft-Banning User...',
    self: "You can't Soft-Ban yourself",
    me: "I won't Soft-Ban myself",
   },
   tempBanAdd: {
    dm: (options: CT.ModOptions<'tempBanAdd'>) =>
     `You have been Temp-Banned from ${options.guild.name}`,
    meNoPerms: "I can't Temp-Ban this User",
    youNoPerms: "You can't Temp-Ban this User",
    error: 'I failed to Temp-Ban this User',
    alreadyApplied: (target: Discord.User) => `${getUser(target)}is already Temp-Banned`,
    success: (target: Discord.User) => `${getUser(target)}was Temp-Banned`,
    loading: 'Temp-Banning User...',
    self: "You can't Temp-Ban yourself",
    me: "I won't Temp-Ban myself",
   },
   channelBanAdd: {
    dm: (options: CT.ModOptions<'channelBanAdd'>) =>
     `You have been Channel-Banned from ${options.channel.name}`,
    meNoPerms: "I can't Channel-Ban this User",
    youNoPerms: "You can't Channel-Ban this User",
    error: 'I failed to Channel-Ban this User',
    alreadyApplied: (target: Discord.User) => `${getUser(target)}is already Channel-Banned`,
    success: (target: Discord.User) => `${getUser(target)}was Channel-Banned`,
    loading: 'Channel-Banning User...',
    self: "You can't Channel-Ban yourself",
    me: "I won't Channel-Ban myself",
    importantChannel: "You can't Channel-Ban Members from the Server's Rules-Channel",
   },
   tempChannelBanAdd: {
    dm: (options: CT.ModOptions<'tempChannelBanAdd'>) =>
     `You have been Temp-Channel-Banned from ${options.channel.name}`,
    meNoPerms: "I can't Temp-Channel-Ban this User",
    youNoPerms: "You can't Temp-Channel-Ban this User",
    error: 'I failed to Temp-Channel-Ban this User',
    alreadyApplied: (target: Discord.User) => `${getUser(target)}is already Temp-Channel-Banned`,
    success: (target: Discord.User) => `${getUser(target)}was Temp-Channel-Banned`,
    loading: 'Temp-Channel-Banning User...',
    self: "You can't Temp-Channel-Ban yourself",
    me: "I won't Temp-Channel-Ban myself",
   },
   channelBanRemove: {
    dm: (options: CT.ModOptions<'channelBanRemove'>) =>
     `You have been Un-Channel-Banned from ${options.channel.name}`,
    meNoPerms: "I can't Un-Channel-Ban this User",
    youNoPerms: "You can't Un-Channel-Ban this User",
    error: 'I failed to Un-Channel-Ban this User',
    alreadyApplied: (target: Discord.User) => `${getUser(target)}isn't Channel-Banned`,
    success: (target: Discord.User) => `${getUser(target)}was Un-Channel-Banned`,
    loading: 'Un-Channel-Banning User...',
    self: "You can't Un-Channel-Ban yourself",
    me: "I won't Un-Channel-Ban myself",
   },
   banRemove: {
    dm: (options: CT.ModOptions<'banRemove'>) =>
     `You have been Un-Banned from ${options.guild.name}`,
    meNoPerms: "I can't Un-Ban this User",
    youNoPerms: "You can't Un-Ban this User",
    error: 'I failed to Un-Ban this User',
    alreadyApplied: (target: Discord.User) => `${getUser(target)}isn't Banned`,
    success: (target: Discord.User) => `${getUser(target)}was Un-Banned`,
    loading: 'Un-Banning User...',
    self: "You can't Un-Ban yourself",
    me: "I won't Un-Ban myself",
   },
   kickAdd: {
    dm: (options: CT.ModOptions<'kickAdd'>) => `You have been Kicked from ${options.guild.name}`,
    meNoPerms: "I can't Kick this User",
    youNoPerms: "You can't Kick this User",
    error: 'I failed to Kick this User',
    alreadyApplied: (target: Discord.User) => `${getUser(target)}is not a Member`,
    success: (target: Discord.User) => `${getUser(target)}was Kicked`,
    loading: 'Kicking User...',
    self: "You can't Kick yourself",
    me: "I won't Kick myself",
   },
   warnAdd: {
    dm: () => `You have been Warned`,
    meNoPerms: "I can't Warn this User",
    youNoPerms: "You can't Warn this User",
    error: 'I failed to Warn this User',
    alreadyApplied: (target: Discord.User) => `${getUser(target)}is already Warned`,
    success: (target: Discord.User) => `${getUser(target)}was Warned`,
    loading: 'Warning User...',
    self: "You can't Warn yourself",
    me: "I won't Warn myself",
   },
   softWarnAdd: {
    dm: () => `You have been Soft-Warned`,
    meNoPerms: "I can't Soft-Warn this User",
    youNoPerms: "You can't Soft-Warn this User",
    error: 'I failed to Soft-Warn this User',
    alreadyApplied: (target: Discord.User) => `${getUser(target)}is already Soft-Warned`,
    success: (target: Discord.User) => `${getUser(target)}was Soft-Warned`,
    loading: 'Soft-Warning User...',
    self: "You can't Soft-Warn yourself",
    me: "I won't Soft-Warn myself",
   },
  },
 },
 leveling: {
  author: (msg: Discord.Message) =>
   `Welcome ${msg.author.username}#${msg.author.discriminator} to ${msg.guild?.name}`,
  description: (reactions?: string) =>
   `${
    reactions ? 'On' : 'Normally, on'
   } this Server, Level-Ups are indicated by Reactions on your Message\n${
    reactions
     ? `The current Reactions are: ${reactions}`
     : "However, I currently don't have access to the Emotes or there are none set"
   }`,
  reason: `${name} Leveling`,
 },
 censor: {
  reasonNewlines: 'Too many Newlines',
  warnNewlines: (n: number) =>
   `You've exceeded the Newlines limit of ${n}.\nPlease send less many Newlines`,
  warnInvite: `You are not allowed to post Invites`,
  reasonInvite: 'Invite posted',
 },
 antivirus: {
  malicious: (cross: string) => `${cross} This Link __is__ Malicious`,
  log: {
   value: (msg: Discord.Message) =>
    `User <@${msg.author.id}> / \`${msg.author.username}#${msg.author.discriminator}\` / \`${
     msg.author.id
    }\`\nposted at least 1 Link in\nChannel <#${msg.channel.id}> / \`${
     'name' in msg.channel ? msg.channel.name : 'Unknown'
    }\` / \`${msg.channel.id}\``,
   name: 'Links with Redirects',
  },
 },
 errors: {
  cantFetch: "Can't fetch Messages in this Channel",
  settingNotFound: 'The Setting could not be found',
  messageNotFound: 'The Mentioned Message could not be found',
  deprecatedByDiscord:
   'This Function has been deprecated by Discord, it does not serve any purpopse anymore.\nYou can go ahead and delete it if you wish.',
  contactSupport: "If you see this Message and don't know what to do, contact Support [click me]",
  inputNoMatch: 'Input did not match validation Regex',
  punishmentNotFound: 'The Mentioned Punishment could not be found',
  invalidEmote: 'Invalid Emote',
  emoteNotFound: 'The Mentioned Emote could not be found',
  notLoggedIn: 'You need to Log-In again',
  noUserMentioned: 'You need to mention a User',
  userNotExist: 'The Mentioned User does not exist',
  userNotFound: 'The Mentioned User could not be found',
  serverNotFound: 'The Mentioned Server could not be found',
  automodRuleNotFound: 'The Mentioned Automod Rule could not be found',
  inviteNotFound: 'The Mentioned Invite could not be found',
  channelNotFound: 'The Mentioned Channel could not be found',
  numTooLarge: 'Number too large',
  numNaN: 'Not a Number',
  guildCommand: 'This Command is only available in Servers',
  memberNotFound: 'Member not found',
  notAvailableAPI: 'This Command is not yet available due to Discord API limitations',
  sendMessage: 'I cannot send Messages in this Channel',
  channelNotManageable: "I'm lacking Permissions to edit that Channel",
  roleNotManageable: "I'm lacking Permissions to manage that Role",
  roleNotFound: 'Role not Found',
  notYours: "You can't interact with someone elses Messages",
  time: 'Time ran out',
  noGuildFound: 'No Server found, please report to the Support Server',
  noChannelFound: 'No Channel found, please report to the Support Server',
  noRoleFound: 'No Role found, please report to the Support Server',
  noThreadCanBeCreated: 'In this Channel, private Threads cannot be created',
  cantManage: "You can't manage this Member",
  cantManageRole: "You can't manage this Role",
  cantManageChannel: "I can't manage this Channel",
  cantManageInvite: "I can't manage this Invite",
  commandNotFound: 'Command not found',
  timeInPast: 'Time is in the past',
 },
 channelRules: {
  HasLeastAttachments: (val: Strumber) => `Has at least ${val} Attachments`,
  HasMostAttachments: (val: Strumber) => `Has at most ${val} Attachments`,
  HasLeastCharacters: (val: Strumber) => `Has at least ${val} Characters in Content`,
  HasMostCharacters: (val: Strumber) => `Has at most ${val} Characters in Content`,
  HasLeastWords: (val: Strumber) => `Has at least ${val} Words in Content`,
  HasMostWords: (val: Strumber) => `Has at most ${val} Words in Content`,
  MentionsLeastUsers: (val: Strumber) => `Mentions at least ${val} Users in Content`,
  MentionsMostUsers: (val: Strumber) => `Mentions at most ${val} Users in Content`,
  MentionsLeastChannels: (val: Strumber) => `Mentions at least ${val} Channels in Content`,
  MentionsMostChannels: (val: Strumber) => `Mentions at most ${val} Channels in Content`,
  MentionsLeastRoles: (val: Strumber) => `Mentions at least ${val} Roles in Content`,
  MentionsMostRoles: (val: Strumber) => `Mentions at most ${val} Roles in Content`,
  HasLeastLinks: (val: Strumber) => `Has at least ${val} Links`,
  HasMostLinks: (val: Strumber) => `Has at most ${val} Links`,
  HasLeastEmotes: (val: Strumber) => `Has at least ${val} Emotes`,
  HasMostEmotes: (val: Strumber) => `Has at most ${val} Emotes`,
  HasLeastMentions: (val: Strumber) => `Has at least ${val} Mentions`,
  HasMostMentions: (val: Strumber) => `Has at most ${val} Mentions`,
 },
 userFlags: {
  Staff: 'Discord Employee',
  DiscordEmployee: 'Discord Employee',
  PartneredServerOwner: 'Partnered Server Owner',
  Partner: 'Partnered Server Owner',
  Hypesquad: 'Hype Squad Events Member',
  HypesquadEvents: 'Hype Squad Events Member',
  HypeSquadEventsMember: 'Hype Squad Events Member',
  BugHunterLevel1: 'Bug Hunter Level 1',
  HypeSquadOnlineHouse1: 'House of Bravery Member',
  HouseBravery: 'House of Bravery Member',
  HypeSquadOnlineHouse2: 'House of Brilliance Member',
  HouseBrilliance: 'House of Brilliance Member',
  HypeSquadOnlineHouse3: 'House of Balance Member',
  HouseBalance: 'House of Balance Member',
  PremiumEarlySupporter: 'Early Supporter',
  EarlySupporter: 'Early Supporter',
  TeamPseudoUser:
   'User is a [Team](https://discord.com/developers/docs/topics/teams "Click to find out what a Team is")',
  TeamUser:
   'User is a [Team](https://discord.com/developers/docs/topics/teams "Click to find out what a Team is")',
  BugHunterLevel2: 'Bug Hunter Level 2',
  VerifiedBot: 'Verified Bot',
  VerifiedDeveloper: 'Early Verified Bot Developer',
  CertifiedModerator: 'Certified Moderator',
  BotHTTPInteractions: 'HTTP Interactions Bot',
  ActiveDeveloper: 'Active Developer',
  Bot: 'Unverified Bot',
  Nitro: 'Nitro',
  Boost1: 'Boosting since less than 2 Months',
  Boost2: 'Boosting since at least 2 Months',
  Boost3: 'Boosting since at least 3 Months',
  Boost6: 'Boosting since at least 6 Months',
  Boost9: 'Boosting since at least 9 Months',
  Boost12: 'Boosting since at least 12 Months',
  Boost15: 'Boosting since at least 15 Months',
  Boost18: 'Boosting since at least 18 Months',
  Boost24: 'Boosting since at least 24 Months',
  Spammer: 'Spammer',
  Quarantined: 'Quarantined',
  MFASMS: '2FA via SMS',
  PremiumPromoDismissed: 'Premium Promotion dismissed',
  HasUnreadUrgentMessages: 'Has unread urgent Messages',
  DisablePremium: 'Premium disabled',
  Collaborator: 'Collaborator',
  RestrictedCollaborator: 'Restricted Collaborator',
 },
 featuresName: 'Features',
 features: {
  ACTIVITIES_ALPHA: 'Can use Activities Alpha',
  ACTIVITIES_EMPLOYEE: 'Is Activities Employee Server',
  ACTIVITIES_INTERNAL_DEV: 'Is Activities Internal Dev Server',
  ANIMATED_BANNER: 'Can set an animated Banner',
  ANIMATED_ICON: 'Can set an animated Icon',
  APPLICATION_COMMAND_PERMISSIONS_V2: 'Application Command Permissions Version 2',
  AUTO_MODERATION: 'Can access Auto-Moderation Settings',
  AUTOMOD_TRIGGER_KEYWORD_FILTER: 'Can use Auto-Moderation Keyword Filter',
  AUTOMOD_TRIGGER_ML_SPAM_FILTER: 'Can use AI-Auto-Moderation Spam Filter',
  AUTOMOD_TRIGGER_SPAM_LINK_FILTER: 'Can use Auto-Moderation Spam Link Filter',
  BANNER: 'Can set a Server Banner Image',
  BFG: 'BFG (?)',
  BOOSTING_TIERS_EXPERIMENT_MEDIUM_GUILD: 'Boosting Tiers Experiment Medium Guild (?)',
  BOOSTING_TIERS_EXPERIMENT_SMALL_GUILD: 'Boosting Tiers Experiment Small Guild (?)',
  BOT_DEVELOPER_EARLY_ACCESS: 'Has access to early access Features for Bot and library Devs',
  BURST_REACTIONS: 'Has access to burst Reactions',
  COMMUNITY_EXP_LARGE_GATED: 'Has access to large Community Experiments (Gated)',
  COMMUNITY_EXP_LARGE_UNGATED: 'Has access to large Community Experiments (Ungated)',
  COMMUNITY_EXP_MEDIUM: 'Has access to Medium Community Experiments',
  CHANNEL_HIGHLIGHTS: 'Has access to Channel Highlights',
  CHANNEL_HIGHLIGHTS_DISABLED: 'Has Channel Highlights disabled',
  CLYDE_ENABLED: 'Has Clyde AI enabled',
  COMMUNITY: 'Server can enable Welcome Screen',
  CREATOR_ACCEPTED_NEW_TERMS: 'Has accepted new Creator Terms of Service',
  CREATOR_MONETIZABLE: 'Has access to monitization Features',
  CREATOR_MONETIZABLE_DISABLED: 'Has disabled monitization Features',
  CREATOR_MONETIZABLE_PROVISIONAL: 'Has access to provisional monitization Features',
  CREATOR_MONETIZABLE_RESTRICTED: 'Has restricted monitization Features',
  CREATOR_MONETIZABLE_WHITEGLOVE:
   'Creator Monetizable Whiteglove\n> (Possibly a enhanced version of the normal Creator Monetization)',
  CREATOR_MONETIZATION_APPLICATION_ALLOWLIST: 'Has access to monitize access for Applications',
  CREATOR_STORE_PAGE: 'Has the Role subscription promo Page enabled',
  DEVELOPER_SUPPORT_SERVER: 'Developer Support Server',
  DISCOVERABLE_DISABLED: 'Has disabled Server Discovery',
  DISCOVERABLE: 'Can be discovered in the Server-Directory',
  ENABLED_DISCOVERABLE_BEFORE: 'Had Server-Discovery enabled at some Point',
  EXPOSED_TO_ACTIVITIES_WTP_EXPERIMENT: 'Has participated in the Activities WTP Experiment',
  GUILD_AUTOMOD_DEFAULT_LIST: 'Has participated in the Auto-Moderation default List Experiment',
  GUILD_COMMUNICATION_DISABLED_GUILDS: 'Is participating in the Communication disabled Experiment',
  GUILD_HOME_OVERRIDE: 'Is participating in the Home feature Experiment',
  GUILD_HOME_TEST: 'Is participating in the Home feature test Experiment',
  GUILD_MEMBER_VERIFICATION_EXPERIMENT:
   'Has participated in the manual approval Verification Experiment',
  GUILD_ONBOARDING: 'Has access to the Server Onboarding',
  GUILD_ONBOARDING_ADMIN_ONLY: 'Has access to Admin-Only Server Onboarding',
  GUILD_ONBOARDING_EVER_ENABLED: 'Had Server Onboarding enabled at some Point',
  GUILD_ONBOARDING_HAS_PROMPTS: 'Has Prompts in the Server Onboarding',
  GUILD_ROLE_SUBSCRIPTIONS: 'Has participated in the Role Subscriptions Experiment',
  GUILD_ROLE_SUBSCRIPTION_PURCHASE_FEEDBACK_LOOP:
   'Has participated in the Mobile Web-Role Subscription purchase Page Experiment',
  GUILD_ROLE_SUBSCRIPTION_TRIALS: 'Has participated in the Role Subscription trials Experiment',
  GUILD_SERVER_GUIDE: 'Has access to the Server Guide',
  GUILD_WEB_PAGE_VANITY_URL: 'Has access to the Web-Page Vanity URL',
  HAD_EARLY_ACTIVITIES_ACCESS:
   'Had access to the Early Activities Experiment and can access them without meeting Boost Requirements',
  HAS_DIRECTORY_ENTRY: 'Is listed in a directory Channel',
  HIDE_FROM_EXPERIMENT_UI: 'Is hidden from the Experiment UI',
  HUB: 'Is a Student Hub',
  INCREASED_THREAD_LIMIT: 'Can have more than 1,000 active Threads',
  INTERNAL_EMPLOYEE_ONLY: 'Only Discord Employees can join this Server',
  INVITE_SPLASH: 'Can set an Invite Splash Background',
  INVITES_DISABLED: 'Has Invites disabled',
  LINKED_TO_HUB: 'Is linked to a student Hub',
  MARKETPLACES_CONNECTION_ROLES: 'Has access to Marketplace Connection Roles',
  MEMBER_PROFILES: 'Members of this Server can set a Server Profile',
  MEMBER_VERIFICATION_GATE_ENABLED: 'Has enabled membership Screening',
  MEMBER_VERIFICATION_MANUAL_APPROVAL: 'Has access to manual approval Verification',
  MOBILE_WEB_ROLE_SUBSCRIPTION_PURCHASE_PAGE:
   'Has access to the Mobile Web-Role Subscription purchase Page',
  MONETIZATION_ENABLED: 'Has enabled Monetization',
  MORE_EMOJI: 'Has access to 150 more Emoji Slots\n>  (Unrelated to Server Boosts)',
  MORE_STICKERS: 'Has access to 60 more Sticker Slots\n>  (Unrelated to Server Boosts)',
  NEWS: 'Can create News-Channels',
  NEW_THREAD_PERMISSIONS: 'Has access to new Thread Permissions',
  PARTNERED: 'Is officially Partnered with Discord',
  PREMIUM_TIER_3_OVERRIDE: 'Has access to Server Boost Level 3 Features bypassing Server Boosts',
  PREVIEW_ENABLED: 'Can be Previewed before joining',
  RAID_ALERTS_ENABLED: 'Has Raid Alerts enabled',
  RAID_ALERTS_DISABLED: 'Raid Alerts Disabled',
  RELAY_ENABLED:
   'Shards can connect with multiple Nodes\n>  (Possibly related to Very Large Guilds (500,000+ Members))',
  RESTRICT_SPAM_RISK_GUILDS: 'Is restricted due to suspection of being a Spam Server',
  ROLE_ICONS: 'Can set Role Icons',
  ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE: 'Has Role Subscriptions that can be purchased',
  ROLE_SUBSCRIPTIONS_ENABLED: 'Has enabled Role Subscriptions',
  ROLE_SUBSCRIPTIONS_ENABLED_FOR_PURCHASE: 'Has enabled Role Subscriptions that can be purchased',
  SHARED_CANVAS_FRIENDS_AND_FAMILY_TEST: 'Has participated in the Shared Canvas Experiment',
  SOUNDBOARD: 'Has participated in the Soundboard Experiment',
  SUMMARIES_ENABLED: 'Is participating in the AI-Chat-Summaries Experiment',
  TEXT_IN_STAGE_ENABLED: 'Has enabled Text in Stage-Channels',
  TEXT_IN_VOICE_ENABLED: 'Has enabled Text in Voice-Channels',
  THREADS_ENABLED_TESTING:
   'Has access to Thread testing Features (only applies to Servers with less than 5 Members, also gives Premium Thread Features)',
  THREADS_ENABLED: 'Has access to Threads Early-Access',
  THREAD_DEFAULT_AUTO_ARCHIVE_DURATION:
   'Thread default Auto-Archive Duration\n>  (used in Testing)',
  THREADS_ONLY_CHANNEL: 'Has previously participated in Thread only Channels Experiment',
  TICKETED_EVENTS_ENABLED: 'Has access to view and manage ticketed Events',
  TICKETING_ENABLED: 'Ticketing enabld (?)',
  VANITY_URL: 'Has a vanity URL',
  VERIFIED: 'Is officially Verified by Discord',
  VIP_REGIONS: 'Has access to 384kbps Voice-Channels',
  VOICE_CHANNEL_EFFECTS: 'Has previously participated in the voice Channel Effects Experiment',
  VOICE_IN_THREADS: 'Can send Voice Messages in Threads',
  WELCOME_SCREEN_ENABLED: 'Has welcome Screen enabled',
  // DEPRECATED
  CHANNEL_BANNER: 'Can set Channel Banners (Deprecated)',
  COMMERCE: 'Can create Store-Channels (Deprecated)',
  EXPOSED_TO_BOOSTING_TIERS_EXPERIMENT: 'Exposed to Boosting Tiers Experiment (Deprecated) (?)',
  FEATURABLE: 'Can be featured in the Server directory (Deprecated)',
  FORCE_RELAY:
   'Shards are forced to connect with multiple Nodes\n>  (Related to very large Guilds (500.000+ Members)) (Deprecated)',
  LURKABLE:
   'Can Lurk in the Server without joining it\n> (Possibly a pre-version of the "Preview" Feature) (Deprecated)',
  MEMBER_LIST_DISABLED:
   'Has disabled the Member List\n> (Created for a Fortnite Event) (Deprecated)',
  PRIVATE_THREADS: 'Has ability to create private Threads (Deprecated)',
  PUBLIC: 'Public Server (Deprecated)',
  PUBLIC_DISABLED: 'Disabled Public Server (Deprecated)',
  SEVEN_DAY_THREAD_ARCHIVE: 'Ability to use 7 Day Thread Archive (Deprecated)',
  THREE_DAY_THREAD_ARCHIVE: 'Ability to use 3 Day Thread Archive (Deprecated)',
 },
 permissions: {
  categories: {
   GENERAL: 'General Server Permissions',
   MEMBER: 'Membership Permissions',
   TEXT: 'Text Channel Permissions',
   VOICE: 'Voice Channel Permissions',
   STAGE: 'Stage Channel Permissions',
   EVENTS: 'Events Permissions',
   ADVANCED: 'Advanced Permissions',
  },
  error: {
   msg: "I'm missing Permissions to execute this Command",
   needed: 'Needed Permissions:',
   you: 'You are missing Permissions to execute this Command',
  },
  perms: {
   AddReactions: 'Add Reactions',
   Administrator: 'Administrator',
   AttachFiles: 'Attach Files',
   BanMembers: 'Ban Members',
   ChangeNickname: 'Change Nickname',
   Connect: 'Connect',
   CreateInstantInvite: 'Create Instant Invite',
   CreatePrivateThreads: 'Create Private Threads',
   CreatePublicThreads: 'Create Public Threads',
   DeafenMembers: 'Deafen Members',
   EmbedLinks: 'Embed Links',
   KickMembers: 'Kick Members',
   ManageChannels: 'Manage Channels',
   ManageEmojisAndStickers: 'Manage Emojis and Stickers',
   ManageEvents: 'Manage Events',
   ManageGuild: 'Manage Guild/Server',
   ManageGuildExpressions: 'Manage Expressions',
   ManageMessages: 'Manage Messages',
   ManageNicknames: 'Manage Nicknames',
   ManageRoles: 'Manage Roles',
   ManageThreads: 'Manage Threads',
   ManageWebhooks: 'Manage Webhooks',
   MentionEveryone: 'Mention Everyone',
   ModerateMembers: 'Moderate Members',
   MoveMembers: 'Move Members',
   MuteMembers: 'Mute Members',
   PrioritySpeaker: 'Priority Speaker',
   ReadMessageHistory: 'Read Message History',
   RequestToSpeak: 'Request to Speak',
   SendMessages: 'Send Messages',
   SendMessagesInThreads: 'Send Messages in Threads',
   SendTTSMessages: 'Send TTS Messages',
   SendVoiceMessages: 'Send Voice Messages',
   Speak: 'Speak',
   Stream: 'Stream',
   UseApplicationCommands: 'Use Application Commands',
   UseEmbeddedActivities: 'Start Embedded Activities',
   UseExternalEmojis: 'Use external Emojis',
   UseExternalSounds: 'Use external Sounds',
   UseExternalStickers: 'Use external Stickers',
   UseSoundboard: 'Use Soundboard',
   UseVAD: 'Use Voice-Activity-Detection',
   ViewAuditLog: 'View Audit Log',
   ViewChannel: 'View Channel',
   ViewCreatorMonetizationAnalytics: 'View Creator Monetization Analytics',
   ViewGuildInsights: 'View Guild/Server Insights',
   ManageChannel: 'Manage Channel',
   ReadMessages: 'Read Messages',
   ViewChannels: 'View Channels',
   ManagePermissions: 'Manage Permissions',
  },
 },
 punishments: {
  warn: 'Warn',
  tempmute: 'Temp-Mute',
  tempchannelban: 'Temp-Channel-Ban',
  channelban: 'Channel-Ban',
  kick: 'Kick',
  tempban: 'Temp-Ban',
  ban: 'Ban',
  strike: 'Strike',
 },
 shoptypes: {
  command: 'Shop-Command',
  message: 'Shop-Message',
 },
 commandTypes: {
  slashCommands: 'Slash-Commands',
  textCommands: 'Text-Commands',
 },
 languages: {
  en: 'English | Finished',
 },
 deleteReasons: {
  deleteCommand: 'Delete Commands',
  deleteReply: 'Delete Reply',
  deleteBlacklist: `${name} Blacklists`,
  leveling: `${name} Leveling`,
  disboard: `${name} DISBOARD Reminder`,
  antivirus: `${name} Anti-Virus`,
  antispam: `${name} Anti-Spam`,
  cooldown: `${name} Cooldowns`,
  abortedMod: 'Aborted Mod Command',
  afk: `${name} AFK`,
 },
 regionsName: 'Regions',
 regions: {
  null: 'Automatic',
  brazil: 'Brazil',
  hongkong: 'Hong Kong',
  india: 'India',
  japan: 'Japan',
  rotterdam: 'Rotterdam',
  russia: 'Russia',
  singapore: 'Singapore',
  southafrica: 'South Africa',
  sydney: 'Sydney',
  'us-central': 'US Central',
  'us-east': 'US East',
  'us-south': 'US South',
  'us-west': 'US West',
  id: 'Indonesia',
  'en-US': 'English US',
  'en-GB': 'Engish GB',
  bg: 'Bulgaria',
  'zh-CN': 'China CN',
  'zh-TW': 'China TW',
  hr: 'Croatia',
  da: 'Denmark',
  nl: 'Netherlands',
  fi: 'Finnish',
  de: 'Germany',
  el: 'Greek',
  hi: 'Hindi',
  hu: 'Hungaria',
  it: 'Italia',
  ja: 'Japan',
  ko: 'Korea',
  lt: 'Lithuania',
  no: 'Norwegia',
  pl: 'Polan',
  'pt-BR': 'Portugal BR',
  ro: 'Romaina',
  ru: 'Russia',
  'en-ES': 'Spain ES',
  'sv-SE': 'Sweden',
  th: 'Thailand',
  tr: 'Turkey',
  uk: 'Ukraine',
  vi: 'Vietnam',
 },
 welcome: (user: Discord.User, guild: Discord.Guild) =>
  `Welcome ${user.username}#${user.discriminator} to ${guild.name} <:AMayakowave:924071188957913108>`,
 scopes: {
  bot: 'Bot',
  connections: 'View Connections',
  'dm_channels.read': 'Read DM Channels',
  email: 'See E-Mail',
  idenfify: 'See all User Info another Discord User would',
  guilds: 'See Guilds',
  'guilds.join': 'Join Servers',
  'guild.members.read': 'See all Member Info another Server Member would',
  'gdm.join': 'Join Group DMs',
  'messages.read': 'Read Messages',
  'role_connections.write': 'give/remove Roles to/from Members',
  rpc: 'Update Activity',
  'rpc.notifications.read': 'Read Discord Notifications',
  'webhook.incoming': 'Create a Webhook for Token Code grants',
  voice: 'Join Voice Channels',
  'application.builds.upload': 'Update/Upload Builds',
  'applications.builds.read': 'See Builds',
  'application.store.update': 'See Store listings, SKUs, Achievements and more',
  'applications.entitlements': 'See Entitlements',
  'relationshipts.read': 'See Friends',
  'activities.read': 'See Activities',
  'activities.write': 'Create Activities',
  'application.commands': 'Use Slash-Commands',
  'applicaiton.commands.update': 'Update Slash-Commands',
  'application.commands.permissions.update': 'Update Slash Command Permissions',
 },
 rolemodes: {
  stack: 'Stack',
  replace: 'Replace',
 },
 defaultAutoArchiveDurationName: 'Default Auto-Archive Duration',
 defaultAutoArchiveDuration: {
  1440: '1 Day',
  4320: '3 Days',
  60: '1 Hour',
  10080: '1 Week',
 },
 defaultForumLayoutName: 'Forum Layout Type',
 defaultForumLayout: {
  2: 'Gallery View',
  1: 'List View',
  0: 'Not Set',
 },
 defaultSortOrderName: 'Default Sort Order',
 defaultSortOrder: {
  0: 'Latest Activity',
  1: 'Newest First',
 },
 auditLogAction,
 Scopes: 'Scopes',
 Result: 'Result',
 stagePrivacyLevels: ['Public', 'Server Only'],
 none,
 defaultValuesLog: (oldValue: string, newValue: string) =>
  `__Before:__\n${oldValue}\n\n__After:__\n${newValue}`,
 reason: 'Reason',
 No: 'No',
 Yes: 'Yes',
 duration: 'Duration',
 attention: 'Attention',
 Embeds: 'Embeds',
 unknown,
 Unknown,
 error: 'Error',
 content: 'Content',
 name: 'Name',
 optional: 'Optional',
 required: 'Required',
 small: 'Small',
 joinedAt: 'Joined At',
 createdAt: 'Created At',
 roles: 'roles',
 large: 'Large',
 loading: 'Loading',
 Enabled: 'Enabled',
 Disabled: 'Disabled',
 Number: 'Number',
 Punishment: 'Punishment',
 noReasonProvided: 'No Reason provided',
 Aborted: 'Aborted',
 Description: 'Description',
 Command: 'Command',
 Type: 'Type',
 noAliases: 'No Aliases',
 Default: 'Default',
 Level: 'Level',
 End: 'End',
 Message: 'Message',
 Added: 'Added',
 Removed: 'Removed',
 Changed: 'Changed',
 Member: 'Member',
 Members: 'Members',
 Role: 'Role',
 Roles: 'Roles',
 Tier: 'Tier',
 Channel: 'Channel',
 Emoji: 'Emoji',
 User: 'User',
 Users: 'Users',
 Application: 'Application',
 Bot: 'Bot',
 Flags: 'Flags',
 ScheduledEvent: 'Scheduled Event',
 Webhook: 'Webhook',
 color: 'Color',
 ChannelRules: 'Channel Rules',
 Channels: 'Channels',
 Current: 'Current',
 Mentionables: 'Mentionables',
 Mentionable: 'Mentionable',
 Done: 'Done',
 None,
 Create: 'Create',
 Detect: 'Detect',
 Refresh: 'Refresh',
 Delete: 'Delete',
 Examples: 'Examples',
 Redacted: 'Redacted',
 Threads: 'Threads',
 Topic: 'Topic',
 Servers: 'Servers',
 Commands: 'Commands',
 login: 'Log-In',
 and: 'and',
 Never: 'Never',
 Join: 'Join',
 Server: 'Server',
 Deprecated: 'Deprecated',
 Overrides: 'Overrides',
 Triggers: 'Triggers',
 Empty: 'Empty',
 Label: 'Label',
 Add: 'Add',
 Edit: 'Edit',
 Before: 'Before',
 After: 'After',
 Extra: 'Extra',
 Invite: 'Invite Custom Bot',
 Other: 'Other',
};
