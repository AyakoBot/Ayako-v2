import type * as Discord from 'discord.js';
import type CT from '../Typings/CustomTypings';
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

const punishmentFields = {
 punishment: {
  name: 'Punishment',
  desc: 'The Punishment Type',
 },
 warnamount: {
  name: 'Warn Amount',
  desc: 'The Amount of Warns required for this Punishment',
 },
 duration: {
  name: 'Duration',
  desc: 'The Duration of the Punishment (only applies to Temporary Punishments)',
 },
};

const usestrike = {
 name: 'Use Strike-System',
 desc: 'Whether to use the Strike-Sytem or not',
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
 name: 'Multiplier',
 desc: 'Multiplier to multiply the awarded XP per Message with',
};

const getForumTag = (tag: Discord.GuildForumTag, emoji?: Discord.Emoji | string) =>
 `${emoji ? `${emoji} ` : ''}\`${tag.name}\` / \`${tag.id}\`${
  tag.moderated ? ` / ${ch.stringEmotes.userFlags.DiscordEmployee} Managed` : ''
 }`;

const getUser = (
 user:
  | CT.bEvalUser
  | Discord.User
  | { bot: boolean; id: string; username: string; discriminator: string },
) =>
 `${user?.bot ? 'Bot' : 'User'} <@${user?.id}> / \`${user?.username}#${user?.discriminator}\` / \`${
  user?.id
 }\`\n`;

const getAutoModerationRule = (rule: Discord.AutoModerationRule) =>
 `Auto-Moderation Rule \`${rule.name}\` / \`${rule.id}\`\n`;

const getMessage = (msg: Discord.Message | Discord.MessageReference) =>
 `[This Message](${ch.getJumpLink(msg)})\n`;

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
 `Emoji ${ch.constants.standard.getEmote(emoji)} / \`${emoji.name ?? none}\` / \`${
  emoji.id ?? none
 }\`\n`;

const getInviteDetails = (
 invite: Discord.Invite,
 user?: Discord.User | CT.bEvalUser,
 channelType?: string,
) =>
 `Code: \`${invite.code}\`\n${user ? `Inviter: ${getUser(user)}` : ''}Uses: ${
  invite.uses
 }\nCreated: ${
  invite.createdAt ? ch.constants.standard.getTime(invite.createdAt.getTime()) : 'unknown'
 }\n${getChannel(invite.channel, channelType)}`;

const getInvite = (invite: Discord.Invite) =>
 `Invite https://discord.gg/${invite.code} / \`${invite.code}\`\n`;

const getIntegration = (integration: Discord.Integration) =>
 `Integration \`${integration.name}\` / \`${integration.id}\`\n`;

const getRole = (role: Discord.Role) => `Role <@&${role.id}> / \`${role.name}\` / \`${role.id}\`\n`;

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

const getGuild = (guild: Discord.Guild | Discord.APIPartialGuild) =>
 `Server \`${guild.name}\` / \`${guild.id}\`\n`;

const getCommand = (command: Discord.ApplicationCommand) =>
 `Command </${command.name}:${command.id}> / \`${command.name}\` / \`${command.id}\`\n`;

const getSticker = (sticker: Discord.Sticker) =>
 `Sticker \`${sticker.name}\` / \`${sticker.id}\`\n`;

const getPunishment = (punishment: CT.punishment) =>
 `Punishment \`${Number(punishment.uniquetimestamp).toString(
  36,
 )}\`\nUse </check:1098291480772235325> to look this Punishment up`;

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
 },
 events: {
  logs: {
   addedRemoved: (added: string, removed: string) =>
    `__**Added**__\n${added}\n\n__**Removed**__\n${removed}`,
   beforeAfter: (before: string, after: string) =>
    `__**Before**__\n${before}\n\n__**Now**__\n${after}`,
   sticker: {
    descCreateAudit: (sticker: Discord.Sticker, user: CT.bEvalUser | Discord.User) =>
     `${getUser(user)}has created\n${getSticker(sticker)}`,
    descCreate: (sticker: Discord.Sticker) => `${getSticker(sticker)}was created`,
    descDeleteAudit: (sticker: Discord.Sticker, user: CT.bEvalUser | Discord.User) =>
     `${getUser(user)}has deleted\n${getSticker(sticker)}`,
    descDelete: (sticker: Discord.Sticker) => `${getSticker(sticker)}was deleted`,
    descUpdateAudit: (sticker: Discord.Sticker, user: CT.bEvalUser | Discord.User) =>
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
     application: CT.bEvalUser | Discord.User,
     user: CT.bEvalUser | Discord.User,
     command: Discord.ApplicationCommand,
    ) =>
     `${getUser(user)}has updated Permissions of\n${getCommand(command)}from\n${getUser(
      application,
     )}`,
    descUpdateAll: (application: CT.bEvalUser | Discord.User, user: CT.bEvalUser | Discord.User) =>
     `${getUser(user)}has updated Permissions of\nall Commands\nfrom\n${getUser(application)}`,
    permissionTypeName: 'Permission Type',
    allChannels: 'All Channels',
   },
   scheduledEvent: {
    descUserRemoveChannel: (
     user: CT.bEvalUser | Discord.User,
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
    descUserRemove: (user: CT.bEvalUser | Discord.User, event: Discord.GuildScheduledEvent) =>
     `${getUser(user)}has left\n${getScheduledEvent(event)}`,
    descUserAddChannel: (
     user: CT.bEvalUser | Discord.User,
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
    descUserAdd: (user: CT.bEvalUser | Discord.User, event: Discord.GuildScheduledEvent) =>
     `${getUser(user)}has joined\n${getScheduledEvent(event)}`,
    descDeleteChannelAudit: (
     event: Discord.GuildScheduledEvent,
     user: CT.bEvalUser | Discord.User,
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
    descDeleteAudit: (event: Discord.GuildScheduledEvent, user: CT.bEvalUser | Discord.User) =>
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
     user: CT.bEvalUser | Discord.User,
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
    descCreateAudit: (event: Discord.GuildScheduledEvent, user: CT.bEvalUser | Discord.User) =>
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
     user: CT.bEvalUser | Discord.User,
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
    descUpdateAudit: (event: Discord.GuildScheduledEvent, user: CT.bEvalUser | Discord.User) =>
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
    descCreate: (
     user: CT.bEvalUser | Discord.User,
     channel: Discord.GuildChannel,
     channelType: string,
    ) => `${getUser(user)}has joined\n${getChannel(channel, channelType)}`,
    descUpdateChannel: (
     user: CT.bEvalUser | Discord.User,
     channel: Discord.GuildChannel,
     channelType: string,
     oldChannel: Discord.GuildChannel | undefined,
     oldChannelType: string | undefined,
    ) =>
     `${getUser(user)}has switched from\n${getChannel(
      oldChannel,
      oldChannelType,
     )}into\n${getChannel(channel, channelType)}`,
    descUpdate: (
     user: CT.bEvalUser | Discord.User,
     channel: Discord.VoiceBasedChannel,
     channelType: string,
    ) => `The Voice State of\n${getUser(user)}in\n${getChannel(channel, channelType)}was updated`,
    descDelete: (
     user: CT.bEvalUser | Discord.User,
     channel: Discord.GuildChannel,
     channelType: string,
    ) => `${getUser(user)}has left\n${getChannel(channel, channelType)}`,
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
     user: CT.bEvalUser | Discord.User,
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
     user: CT.bEvalUser | Discord.User,
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
     user: CT.bEvalUser | Discord.User,
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
    descCreateAudit: (user: CT.bEvalUser | Discord.User, role: Discord.Role) =>
     `${getUser(user)}has created\n${getRole(role)}`,
    descCreate: (role: Discord.Role) => `${getRole(role)}was created`,
    descDeleteAudit: (user: CT.bEvalUser | Discord.User, role: Discord.Role) =>
     `${getUser(user)}has deleted\n${getRole(role)}`,
    descDelete: (role: Discord.Role) => `${getRole(role)}was deleted`,
    descUpdateAudit: (role: Discord.Role, user: CT.bEvalUser | Discord.User) =>
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
   },
   reaction: {
    descAdded: (emoji: Discord.Emoji, user: CT.bEvalUser | Discord.User, msg: Discord.Message) =>
     `${getUser(user)}has reacted with\n${getEmote(emoji)}to\n${getMessage(msg)}`,
    descRemoved: (emoji: Discord.Emoji, user: CT.bEvalUser | Discord.User, msg: Discord.Message) =>
     `Reaction on\n${getMessage(msg)}with ${getEmote(emoji)}by ${getUser(
      user,
     )}was removed,\neither by the reactor themself or by a Moderator`,
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
    descDeleteAudit: (user: CT.bEvalUser | Discord.User, msg: Discord.Message) =>
     `${getUser(user)}has deleted\n${getMessage(msg)}from\n${getUser(msg.author)}`,
    descDelete: (msg: Discord.Message) =>
     `${getMessage(msg)}from\n${getUser(msg.author)}was deleted`,
    descDeleteBulkAudit: (
     user: CT.bEvalUser | Discord.User,
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
   },
   invite: {
    descCreateAudit: (user: CT.bEvalUser | Discord.User, invite: Discord.Invite) =>
     `${getUser(user)}has created\n${getInvite(invite)}`,
    descCreate: (invite: Discord.Invite) => `${getInvite(invite)}was created`,
    descDeleteAudit: (user: CT.bEvalUser | Discord.User, invite: Discord.Invite) =>
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
    descCreateAudit: (integration: Discord.Integration, user: CT.bEvalUser | Discord.User) =>
     `${getUser(user)}has created\n${getIntegration(integration)}`,
    descCreate: (integration: Discord.Integration) => `${getIntegration(integration)}was created`,
    descDeleteIntegrationAudit: (
     user: CT.bEvalUser | Discord.User,
     integration: Discord.Integration,
     application: Discord.Application,
    ) =>
     `${getUser(user)}has deleted\n${getIntegration(integration)}from${getApplication(
      application,
     )}`,
    descDeleteAudit: (user: CT.bEvalUser | Discord.User, integration: Discord.Integration) =>
     `${getUser(user)}has deleted\n${getIntegration(integration)}`,
    descDeleteIntegration: (integration: Discord.Integration) =>
     `${getIntegration(integration)}was deleted`,
    descUpdateAudit: (user: CT.bEvalUser | Discord.User, integration: Discord.Integration) =>
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
    descBan: (user: CT.bEvalUser | Discord.User) => `${getUser(user)}was banned`,
    descBanAudit: (user: CT.bEvalUser | Discord.User, executor: Discord.User) =>
     `${getUser(executor)}has banned\n${getUser(user)}`,
    descUnban: (user: CT.bEvalUser | Discord.User) => `${getUser(user)} was un-banned`,
    descUnbanAudit: (user: CT.bEvalUser | Discord.User, executor: Discord.User) =>
     `${getUser(executor)}has un-banned\n${getUser(user)}`,
    descEmojiCreateAudit: (user: CT.bEvalUser | Discord.User, emoji: Discord.Emoji) =>
     `${getUser(user)}has created\n${getEmote(emoji)}`,
    descEmojiCreate: (emoji: Discord.Emoji) => `${getEmote(emoji)}was created`,
    descEmojiDeleteAudit: (user: CT.bEvalUser | Discord.User, emoji: Discord.Emoji) =>
     `${getUser(user)}has deleted\n${getEmote(emoji)}`,
    descEmojiDelete: (emoji: Discord.Emoji) => `${getEmote(emoji)}was deleted`,
    descEmojiUpdateAudit: (user: CT.bEvalUser | Discord.User, emoji: Discord.Emoji) =>
     `${getUser(user)}has updated\n${getEmote(emoji)}`,
    descEmojiUpdate: (emoji: Discord.Emoji) => `${getEmote(emoji)}was updated`,
    descJoinAudit: (user: CT.bEvalUser | Discord.User, executor: Discord.User) =>
     `${getUser(executor)}has added\n${getUser(user)}`,
    descMemberJoin: (user: CT.bEvalUser | Discord.User) => `${getUser(user)}has joined`,
    descBotJoin: (user: CT.bEvalUser | Discord.User) => `${getUser(user)}was added`,
    descBotLeave: (user: CT.bEvalUser | Discord.User) => `${getUser(user)}has left the Server`,
    descBotLeaveAudit: (user: CT.bEvalUser | Discord.User, executor: Discord.User) =>
     `${getUser(executor)}has kicked\n${getUser(user)}`,
    descMemberLeave: (user: CT.bEvalUser | Discord.User) => `${getUser(user)}has left the Server`,
    descMemberLeaveAudit: (user: CT.bEvalUser | Discord.User, executor: Discord.User) =>
     `${getUser(executor)}has kicked\n${getUser(user)}`,
    descBotUpdate: (user: CT.bEvalUser | Discord.User) => `${getUser(user)}was updated`,
    descBotUpdateAudit: (user: CT.bEvalUser | Discord.User, executor: Discord.User) =>
     `${getUser(executor)}has updated\n${getUser(user)}`,
    descMemberUpdate: (user: CT.bEvalUser | Discord.User) => `${getUser(user)}was updated`,
    descMemberUpdateAudit: (user: CT.bEvalUser | Discord.User, executor: Discord.User) =>
     `${getUser(executor)}has updated\n${getUser(user)}`,
    descGuildUpdate: () => `The Server was updated`,
    descGuildUpdateAudit: (executor: Discord.User) => `${getUser(executor)}has updated the Server`,
    memberJoin: 'Member joined',
    botJoin: 'Bot joined',
    ban: 'User banned',
    unban: 'User un-banned',
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
    guildUpdate: 'Guild updated',
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
    },
    pending: 'Pending',
   },
   channel: {
    descCreateAudit: (
     user: CT.bEvalUser | Discord.User,
     channel: Discord.GuildChannel | Discord.AnyThreadChannel,
     type: string,
    ) => `${getUser(user)}has created\n${getChannel(channel, type)}`,
    descCreate: (channel: Discord.GuildChannel | Discord.AnyThreadChannel, type: string) =>
     `${getChannel(channel, type)}was created`,
    descDeleteAudit: (
     user: CT.bEvalUser | Discord.User,
     channel: Discord.GuildChannel | Discord.AnyThreadChannel,
     type: string,
    ) => `${getUser(user)}has deleted\n${getChannel(channel, type)}`,
    descDelete: (channel: Discord.GuildChannel | Discord.AnyThreadChannel, type: string) =>
     `${getChannel(channel, type)}was deleted`,
    descUpdateAudit: (
     user: CT.bEvalUser | Discord.User,
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
     user: CT.bEvalUser | Discord.User,
    ) => `${getUser(user)}has changed\n${getChannel(channel, channelType)}`,
    descUpdateStage: (channel: Discord.StageChannel, channelType: string) =>
     `${getChannel(channel, channelType)}was changed`,
    descCreateStageAudit: (
     channel: Discord.StageChannel,
     channelType: string,
     user: CT.bEvalUser | Discord.User,
    ) => `${getUser(user)}has started\n${getChannel(channel, channelType)}`,
    descCreateStage: (channel: Discord.StageChannel, channelType: string) =>
     `${getChannel(channel, channelType)}was started`,
    descDeleteStageAudit: (
     channel: Discord.StageChannel,
     channelType: string,
     user: CT.bEvalUser | Discord.User,
    ) => `${getUser(user)}has ended\n${getChannel(channel, channelType)}`,
    descDeleteStage: (channel: Discord.StageChannel, channelType: string) =>
     `${getChannel(channel, channelType)}was ended`,
    descPinCreateAudit: (
     user: CT.bEvalUser | Discord.User,
     msg: Discord.Message,
     channelType: string,
    ) =>
     `${getUser(user)}has pinned\n${getMessage(msg)}in\n${getChannel(msg.channel, channelType)}`,
    descPinCreate: (msg: Discord.Message, channelType: string) =>
     `${getMessage(msg)}was pinned in\n${getChannel(msg.channel, channelType)}`,
    descPinRemoveAudit: (
     user: CT.bEvalUser | Discord.User,
     msg: Discord.Message,
     channelType: string,
    ) =>
     `${getUser(user)}has un-pinned\n${getMessage(msg)}in\n${getChannel(msg.channel, channelType)}`,
    descPinRemove: (msg: Discord.Message, channelType: string) =>
     `${getMessage(msg)}was un-pinned in\n${getChannel(msg.channel, channelType)}`,
    descTyping: (
     user: CT.bEvalUser | Discord.User,
     channel: Discord.GuildTextBasedChannel,
     channelType: string,
    ) => `${getUser(user)}has started typing in\n${getChannel(channel, channelType)}`,
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
     Pinned: 'Pinned to Top of Forum',
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
    desc: (user: CT.bEvalUser | Discord.User) => `${getUser(user)}has updated`,
    avatar: 'Avatar',
    flags: 'Badges',
    discriminator: 'Tag',
    username: 'Username',
   },
   automodActionExecution: {
    name: 'Auto-Moderation Rule enforced',
    descMessage: (
     rule: Discord.AutoModerationRule,
     msg: Discord.Message,
     user: CT.bEvalUser | Discord.User,
    ) =>
     `${getAutoModerationRule(rule)}was enforced on\nthis ${getMessage(msg)}from\n${getUser(user)}`,
    desc: (rule: Discord.AutoModerationRule, user: CT.bEvalUser | Discord.User) =>
     `${getAutoModerationRule(rule)}was enforced on\n${getUser(user)}`,
    matchedKeyword: 'Matched Keyword',
    matchedContent: 'Matched Content',
    content: 'Content',
    ruleTriggerTypeName: 'Rule Trigger Type',
    ruleTriggerType: {
     1: 'Keyword Filter',
     2: 'Harmful Link Filter',
     3: 'Spam Filter',
     4: 'Keyword Preset Filter',
     5: 'Mention Spam Filter',
    },
    actionTypeName: 'Action Type',
    actionType: {
     1: 'Block Message',
     2: 'Send Alert Message',
     3: 'Timeout',
    },
    alert: 'Alert sent',
    timeout: 'User timed-out',
    alertChannel: 'Alert Channel',
   },
   automodRule: {
    descCreate: (user: CT.bEvalUser | Discord.User, rule: Discord.AutoModerationRule) =>
     `${getUser(user)}created\n${getAutoModerationRule(rule)}`,
    descDelete: (user: CT.bEvalUser | Discord.User, rule: Discord.AutoModerationRule) =>
     `${getUser(user)}deleted\n${getAutoModerationRule(rule)}`,
    descUpdate: (user: CT.bEvalUser | Discord.User, rule: Discord.AutoModerationRule) =>
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
    enabled: 'Enabled',
    eventTypeName: 'Event Type',
    eventType: {
     1: 'Message Send',
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
    },
    alertChannel: 'Alert Channel',
    timeoutDuration: 'Timeout Duration',
    actions: 'Actions',
   },
  },
  messageReactionAdd: {
   rrReason: `${name} Reaction Roles`,
  },
  messageReactionRemove: {
   rrReason: `${name} Reaction Roles`,
  },
  guildMemberUpdate: {
   boostingStart: 'Member Started Boosting',
   boostingEnd: 'Member Stopped Boosting',
   descriptionBoostingStart: (user: CT.bEvalUser | Discord.User) =>
    `User <@${user.id}> / \`${user.username}#${user.discriminator}\` / \`${user.id}\`\nhas started Boosting the Server`,
   descriptionBoostingEnd: (user: CT.bEvalUser | Discord.User) =>
    `User <@${user.id}> / \`${user.username}#${user.discriminator}\` / \`${user.id}\`\nhas stopped Boosting the Server`,
  },
  ready: {
   channelunban: 'Automatically Channel-Unbanned',
   unban: 'Automatically Un-Banned',
   unmute: 'Automatically Un-Muted',
   disboard: {
    desc: 'You can now Bump this Server again!\n\nPlease type </bump:947088344167366698>',
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
    gotRole: (user: CT.bEvalUser | Discord.User, role: Discord.Role, days: Strumber) =>
     `<@${user.id}> has been given the <@&${role.id}> role for boosting longer than ${days} days`,
   },
  },
  vote: {
   bot: (user: CT.bEvalUser | Discord.User, bot: CT.bEvalUser | Discord.User) =>
    `Thanks to ${user.discriminator} for voting for ${bot.username}!`,
   guild: (user: CT.bEvalUser | Discord.User, guild: Discord.Guild) =>
    `Thanks to ${user.discriminator} for voting for ${guild.name}!`,
   reward: (reward: string) => `\nYou have received ${reward} for the next 12 hours.`,
   xpmultiplier: 'XP Multiplier',
   botReason: (bot: CT.bEvalUser | Discord.User) => `Voted for ${bot.username}`,
   guildReason: (guild: Discord.Guild) => `Voted for ${guild.name}`,
   endReason: 'Vote ran out',
   reminder: {
    name: 'You can vote again!',
    descBot: (bot: CT.bEvalUser | Discord.User) =>
     `Your Vote time-out for \`${bot.tag}\` has ended`,
    descGuild: (guild: Discord.Guild) => `Your Vote time-out for \`${guild.name}\` has ended`,
    voteBot: (bot: CT.bEvalUser | Discord.User) =>
     `[Click here to Vote again](https://top.gg/bot/${bot.id}/vote)`,
    voteGuild: (guild: Discord.Guild) =>
     `[Click here to Vote again](https://top.gg/servers/${guild.id}/vote)`,
    voteBotButton: (bot: CT.bEvalUser | Discord.User) => `Vote for ${bot.username}`,
    voteGuildButton: (guild: Discord.Guild) => `Vote for ${guild.name}`,
    voteAyakoButton: `Vote for ${name}`,
    disable: 'Disable all Vote Reminders',
   },
  },
  appeal: {
   title: 'New Appeal',
   author: `${client.user?.username} Punishment Appeal System`,
   description: (user: CT.bEvalUser | Discord.User, punishment: CT.punishment) =>
    `${getUser(user)}has appealed their Punishment\n${getPunishment(punishment)}`,
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
   start: (user: CT.bEvalUser | Discord.User) => `${getUser(user)}started Verification`,
   end: (user: CT.bEvalUser | Discord.User) => `${getUser(user)}finished Verification`,
   started: 'Verification Started',
   finished: 'Verification Finished',
  },
  hint: 'Hint',
  enterCode: 'Enter Code',
 },
 time,
 expire: {
  punishmentIssue: 'Punishment was issued at',
  punishmentOf: (target: Discord.User | CT.bEvalUser) =>
   `A Punishment of ${target.username}#${target.discriminator} has expired`,
  punishmentIn: 'Punished in',
  punishmentBy: 'Punished by',
  end: 'Punishment End',
  endedAt: (t: string) => `Punishment ended ${t}`,
  duration: 'Punishment Duration',
  pardonedBy: 'Pardoned by',
 },
 commands: {
  deleteHandler: {
   reasonCommand: `Command declared as Self-Deleting in ${name} Settings`,
   reasonReply: `Reply declared as Self-Deleting in ${name} Settings`,
  },
  antispamHandler: {
   banErrorMessage: (user: CT.bEvalUser | Discord.User) =>
    `I was unable to ban <@${user.id}>. \`Insufficient Permissions\``,
   kickErrorMessage: (user: CT.bEvalUser | Discord.User) =>
    `I was unable to kick <@${user.id}>. \`Insufficient Permissions\``,
  },
  afk: {
   category: 'Chat',
   description:
    'Display a AFK text whenever someone pings you.\nAutomatically deleted if you send a Message 1 Minute after creating your AFK',
   usage: ['afk (text)'],
   footer: (userID: string, t: Strumber) => `<@${userID}> is AFK since ${t}`,
   updatedTo: (user: CT.bEvalUser | Discord.User, text: string) =>
    `**<@${user.id}>'s AFK updated to:**\n${text}`,
   updated: (user: CT.bEvalUser | Discord.User) => `**<@${user.id}>'s AFK updated**`,
   noLinks: '**You may not set Links as AFK.**',
   set: (user: CT.bEvalUser | Discord.User) => `**<@${user.id}>'s AFK set**`,
   setTo: (user: CT.bEvalUser | Discord.User, text: string) =>
    `**<@${user.id}>'s AFK set to:**\n${text}`,
  },
  antiraidHandler: {
   debugMessage: {
    author: 'Join Threshold Breached!',
    description: 'The join Threshold was breached',
    below: 'Every join within the last 20 Seconds:',
    file: 'Every join within the last 20 Seconds can be found in the File attached',
    printIDs: 'Print User IDs',
    massban: 'Massban Users',
   },
  },
  afkHandler: {
   deletedAfk: "I've deleted your AFK",
   footer: (t: Strumber) => `Welcome back! You have been AFK for ${t}`,
   setAfk: 'User went AFK',
   delAfk: 'User returned from being AFK',
   forceDelAfk: (user: CT.bEvalUser | Discord.User, reason: string) =>
    `User's AFK was forcefully deleted by ${user.username}#${user.discriminator} | ${reason}`,
  },
  commandHandler: {
   GuildOnly: 'This Command is not made for DMs, please try again in a Server',
   pleaseWait: (t: Strumber) => `Please wait ${t} before re-using this Command`,
   CategoryDisabled: (category: string) =>
    `Category \`${category}\` was disabled by the Server Administration`,
   CommandDisabled: (n: string) => `Command \`${n}\` was disabled by the Server Administration`,
   creatorOnly: 'Only my Creator can use this Command (`Lars_und_so#0666`)',
   ownerOnly: 'Only the Owner of this Server can use this Command',
   missingPermissions: "You don't have enough Permissions to use this Command",
   verifyMessage:
    'You just issued a **moderation command** by **editing your Message**. \nDo you want to **proceed or abort**.',
   DMonly: 'This Command is not made for Servers, please try again in DMs',
   modRoleError: 'One of your Roles does not allow you to use this Command',
  },
  toxicityCheck: {
   warning: (user: CT.bEvalUser | Discord.User) => `<@${user.id}> Please do not use this word!`,
   warnReason: 'Repeatedly sending Blacklisted words',
   author: `${name} Blacklist`,
   info: (guild: Discord.Guild) =>
    `The following Words are Blacklisted on **\`${guild.name}\`**:\n`,
  },
  reminder: {
   category: 'Info',
   description: `Set, view and delete Reminders ${name} will remind you of`,
   usage: ['reminder [duration] [text]', 'reminder delete [reminder ID]', 'reminder list'],
   set: 'set',
   delete: 'delete',
   list: 'list',
   created: (id: Strumber, t: Strumber) =>
    `Successfully created Reminder with ID \`${id}\`\nReminder End: ${t}`,
   invalidTime: 'The given Time was not valid',
   noReason: 'Please provide a Reason to Remind you of',
   reminderEnded: (reason: string) => `__Your Reminder has ended:__\n${reason}`,
   placeholder: 'Select a Reminder to Edit/Delete',
   editReason: 'Edit',
   del: 'Delete Reminder',
   desc:
    'Use the Buttons below to Select a Reminder to Edit or Delete\nTo create a Reminder use the `reminder [duration] [text]` Command',
   author: `${name} Reminders`,
   ends: 'Ends',
   editTitle: 'Edit a Reminder',
   timeLabel: 'Insert new Time Below',
   editLabel: 'Insert new Text Below',
   editPlaceholder: `Remind me to Vote for ${name}!`,
   timePlaceholder: '11 hours 30 minutes',
  },
 },
 contextCommands: {
  message: {
   'stick-message': {
    reply:
     'Message was sticked to the channel\nYou can undo this at any time by deleting the sticked Message',
    button: 'Delete this Message to unstick it',
    already:
     'This Channel already has a sticked Message.\nYou can merge them into one and stick the merged Message\n\nTo unstick the previous Message, just delete it',
   },
  },
 },
 stringCommands: {},
 slashCommands: {
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
     'Also Embeds have a maximum of 6000 Characters, so you probably wont ever fill this one',
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
        'Can be "random", "none", empty or the Name of a Color. Prefix Hex Colors with "#"',
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
     'Use the Buttons below to edit your embed\n\nFor Timestamp help, visit [hammertime.cyou](https://hammertime.cyou/) or [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format)\n\nSupported String Replacements',
    quick: 'Quick Help',
    fields: [
     'This Part is used in Leveling Settings\n`{{msg.author}}` mentions the User that sent the triggering Message\n`{{msg.channel}}` mentions the Channel that the triggering Message was sent in\n`{{msg.guild.name}}` displays the Servers Name\n`{{msg.guild.memberCount}}` displays the Servers Member Count\nhttps://discord.js.org/#/docs/discord.js/main/class/Message',
     'This Part is used in Welcome Settings\n`{{member}}` mentions the User that joined the Server\n`{{member.displayName}}` displays the Name of the joined Member\n`{{member.guild.name}}` displays the Servers Name\n`{{member.guild.memberCount}}` displays the Servers Member Count\nhttps://discord.js.org/#/docs/discord.js/main/class/GuildMember',
     'You can use </stp:1103033240320745595> to test the `{{msg}}` Templates',
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
  strike: {
   noneFound: 'Your most used Reasons will appear here',
   areYouSure: (user: CT.bEvalUser | Discord.User, punishment: string) =>
    `You are about to strike **${user}**\nDue to their Amount of Warns, this will ${punishment} them\n**Do you want to proceed?**`,
   confirmAuthor: 'Confirm Strike',
   notEnabled:
    'The Strike System is not enabled\nuse </settings auto-moderation:1014159057919156366> `setting: Auto-Punish` to enable it',
  },
  membercount: {
   author: `${name} Member-Count`,
  },
  ping: {
   author: `${name} Ping`,
   lastHeartbeat: 'Last Heartbeat',
  },
  info: {
   basic: '__Basic Info__',
   stats: '__Statistics__',
   otherInfo: '__Other Info__',
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
    } is a Discord Bot written in [TypeScript](https://www.typescriptlang.org/) using the [Discord.JS Library](https://discord.js.org/)\n\nIt is currently in Version ${ch.util.makeInlineCode(
     packageJSON.version,
    )} and is being developed and maintained by <@318453143476371456> (@Lars_und_so).
    A Full-Time IT Specialist for Application Development
    View [Credits](https://ayakobot.com/credits) for more Information
    Ayako's complete Source-Code is Open-Source and available on [GitHub](https://github.com/AyakoBot)
    For more Information, visit [AyakoBot.com](https://ayakobot.com/)
    Ayako also has a [YouTube Channel](https://www.youtube.com/@AyakoBot) with Tutorials
    
    Ayako started as a small Moderation Bot for the large Discord Server [Animekos](https://discord.gg/animekos) in 2019.
    Its success is owed to <@267835618032222209> (@Victoria) who first gave this Bot a chance on her Server,
    and <@244126983489978368> (@PandaFish) who first taught me how to code [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)`,
   },
   user: {
    authorUser: `${name} User-Info`,
    authorBot: `${name} Bot-Info`,
    userInfo: (user: Discord.User) =>
     `**User:** ${user}\n**Tag:** \`${user.tag}\`\n**Discriminator:** \`${
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
    desc: (thread: Discord.PrivateThreadChannel) =>
     `Check the Emote-Collector Thread (${thread}) to select an Emote\n\nOnce finished, press the "Detect" Button.\nThe Thread will then self-delete. Click the Button below to return to the update Settings Menu`,
    name: 'Emote-Collector',
   },
   categories: {
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
    'anti-spam-punishments': {
     name: 'Anti-Spam Punishments',
     fields: punishmentFields,
    },
    'anti-spam': {
     name: 'Anti-Spam',
     fields: {
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
      usestrike,
     },
    },
    'anti-virus': {
     name: 'Anti-Virus',
     fields: {
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
      usestrike,
     },
    },
    'anti-virus-punishments': {
     name: 'Anti-Virus Punishments',
     fields: punishmentFields,
    },
    'anti-raid': {
     name: 'Anti-Raid',
     fields: {
      punishment: {
       name: 'Punishment',
       desc: 'The Punishment Type',
      },
      posttof: {
       name: 'Post',
       desc: 'Whether to post a Raid Notice',
      },
      postchannel: {
       name: 'Post-Channels',
       desc: 'Where to Post a Raid Notice',
      },
      pingroles: {
       name: 'Ping Roles',
       desc: 'Roles to Ping with the Raid Notice',
      },
      pingusers: {
       name: 'Ping Users',
       desc: 'Users to Ping with the Raid Notice',
      },
      time: {
       name: 'Join-Remember Time',
       desc: 'Users to Ping with the Raid Notice',
      },
      jointhreshold: {
       name: 'Join Threshold',
       desc: 'Amount of Joins required before Anti-Raid triggers',
      },
      punishmenttof: {
       name: 'Punish',
       desc: 'Whether to Punish Raiders',
      },
     },
    },
    'auto-punish': {
     name: 'Auto-Punish',
     fields: {
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
      confirmationreq: {
       name: 'Require confirmation',
       desc: 'Whether to ask for Confirmation before proceeding with a Punishment',
      },
      punishmentawaittime: {
       name: 'Confimation await Time',
       desc: 'How long to wait for Human confirmation before the Punishment is aborted',
      },
     },
    },
    blacklist: {
     action: {
      author: 'Blacklisted Word used',
      field: 'You used following Words',
      desc: (words: string) =>
       `Please refrain from using any of the following Words\nThis __includes__ not blacklisted Variations of following Words\n*Server Staff may punish more strictly for bypassing the Blacklist*\n${words}`,
     },
     name: 'Blacklist',
     fields: {
      words: {
       name: 'Words / Phrases',
       desc: 'Words or Phrases that should be filtered (Separate by #)',
      },
      usestrike,
     },
    },
    'blacklist-punishments': {
     name: 'Blacklist Punishments',
     fields: punishmentFields,
    },
    expiry: {
     desc: `⚠️ Note: ⚠️\nAll of these Settings are ${name}-Internal!\nExample: Setting Bans to expire after 5 Months will not lead to an Auto-Unban after 5 Months, the entry will just be deleted from Commands like </check:1019550801355624478>`,
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
     fields: {
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
       name: 'Currency',
       desc: 'Amount of Currency rewarded',
      },
      roleposition: {
       name: 'Role Position',
       desc: 'The Role under which the custom Roles will be created',
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
       name: 'Cooldown (in Seconds)',
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
       name: 'Sticky-Roles Active',
       desc: 'Whether Sticky-Roles is active or not',
      },
      stickypermsactive: {
       name: 'Sticky-Channel-Perms Active',
       desc: 'Whether Sticky-Channel-Perms is active or not',
      },
     },
    },
    suggestions: {
     name: 'Suggestions',
     fields: {
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
       desc:
        'The Welcome Embed to use\nYou can create one using </embed-builder create:1088143287635943485>',
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
     desc: 'Announce Votes for your Server or Bot on Top.gg',
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
       name: 'Log Channels',
       desc: 'The Channels in which to Log when Members start or stop boosting and more',
      },
      rolemode: {
       name: 'Role Mode',
       desc: 'Whether to Stack or Replace Nitro-Roles',
      },
     },
    },
    'button-role-settings': {
     name: 'Button Settings',
     fields: {
      messagelink: {
       name: 'Message',
       desc: 'The Message these Settings apply to',
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
     name: 'Reaction Settings',
     fields: {
      messagelink: {
       name: 'Message',
       desc: 'The Message these Settings apply to',
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
    'reaction-roles': {
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
    'delete-commands': {
     name: 'Delete-Commands',
     fields: {
      deletecommand: {
       name: 'Delete Command',
       desc: 'Whether to delete the Command',
      },
      deletereply: {
       name: 'Delete Reply',
       desc: 'Whether to delete the Command Reply',
      },
      deletetimeout: {
       name: 'Delete Timeout',
       desc: 'The Timeout until the Reply or Command is deleted',
      },
      command: {
       name: 'Command',
       desc: 'The Command this Delete-Setting applies to',
      },
      activechannelid: {
       name: 'Active Channel',
       desc: 'The Channels this Delete-Setting applies to',
      },
     },
    },
    logs: {
     name: 'Logs',
     fields: {
      applicationevents: {
       name: 'Application Events',
       desc: 'The Channel to log Application Events in',
      },
      automodevents: {
       name: 'Auto-Mod Events',
       desc: 'The Channel to log Auto-Mod Events in',
      },
      channelevents: {
       name: 'Channel Events',
       desc: 'The Channel to log Channel Events in',
      },
      emojievents: {
       name: 'Emoji Events',
       desc: 'The Channel to log Emoji Events in',
      },
      guildevents: {
       name: 'Server Events',
       desc: 'The Channel to log Server Events in',
      },
      scheduledeventevents: {
       name: 'Scheduled Event Events',
       desc: 'The Channel to log Scheduled Event Events in',
      },
      inviteevents: {
       name: 'Invite Events',
       desc: 'The Channel to log Invite Events in',
      },
      messageevents: {
       name: 'Message Events',
       desc: 'The Channel to log Message Events in',
      },
      roleevents: {
       name: 'Role Events',
       desc: 'The Channel to log Role Events in',
      },
      stageevents: {
       name: 'Stage Events',
       desc: 'The Channel to log Stage Events in',
      },
      stickerevents: {
       name: 'Sticker Events',
       desc: 'The Channel to log Sticker Events in',
      },
      typingevents: {
       name: 'Typing Events',
       desc: 'The Channel to log Typing Events in',
      },
      userevents: {
       name: 'User Events',
       desc: 'The Channel to log User Events in',
      },
      voiceevents: {
       name: 'Voice Events',
       desc: 'The Channel to log Voice Events in',
      },
      webhookevents: {
       name: 'Webhook Events',
       desc: 'The Channel to log Application Events in',
      },
      settingslog: {
       name: 'Settings Log',
       desc: 'The Channel to log Settings Events in',
      },
      modlog: {
       name: 'Moderation Log',
       desc: 'The Channel to log Moderation Events in',
      },
      reactionevents: {
       name: 'Reaction Events',
       desc: 'The Channel to log Reaction Events in',
      },
      memberevents: {
       name: 'Member Events',
       desc: 'The Channel to log Member Events in',
      },
     },
    },
    basic: {
     name: 'Basic',
     fields: {
      prefix: {
       name: 'Prefix',
       desc: `The Prefix ${name} should listen to`,
      },
      interactionsmode: {
       name: 'RP Command Size',
       desc: 'Whether RP Commands should be large or small',
      },
      lan: {
       name: 'Language',
       desc: `The Language ${name} displays in`,
      },
      errorchannel: {
       name: 'Error Channel',
       desc: 'The Channel to post Error Messages in',
      },
     },
    },
    'nitro-roles': {
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
   description: 'Create a Giveaway',
   usage: ['giveaway'],
   category: 'Giveaway',
   noneFound: 'No Giveaways found',
   create: {
    description: 'Create a Giveaway',
    missingPermissions: "I can't send or view Messages in this Channel",
    invalidTime: 'The provided Time was invalid',
    author: `${name} Giveaways`,
    participants: 'Participants',
    winners: 'Possible Winners: ',
    end: 'End:',
    host: 'Giveaway Host',
    roleRequire: 'Required Role to enter this Giveaway',
    participate: 'Participate',
    sent: (channel: Discord.Channel) => `Giveaway started in <#${channel.id}>`,
    error: 'Failed to create Giveaway',
   },
   end: {
    description: 'End a Giveaway manually',
    ended: 'Ended',
    winner: 'Winner',
    winners: 'Winners',
    author: `${name} Giveaways`,
    title: 'Congratulations! You won a Giveaway! [Click me to get to the Giveaway]',
    trouble: 'If you have trouble with your Giveaway, DM or Mention the User below',
    getPrize: 'To get your Prize, DM or Mention the User below',
    couldntDM: (user: CT.bEvalUser | Discord.User) =>
     `I was unable to DM <@${user.id}> / \`${user.username}#${user.discriminator}\` / \`${user.id}\``,
    noValidEntries: 'No valid Entries | No Winner picked',
    checkDMs: 'Check your DMs! | If you had your DMs closed, DM or Mention the User below',
    button: 'Get to Giveaway',
    manuallyEnded: 'Manually Ended Giveaway',
    clickButton: 'Click the Button below to claim your Prize',
    limitedTime: (inTime: string, t: string) => `Your prize expires ${inTime} (${t})`,
    timeRanOut:
     'You can no longer claim your Prize since you took too long to claim it\nI will now re-roll the Giveaway',
   },
   participate: {
    cantEnter: "You don't meet the Requirements to participate in this Giveaway",
    entered: 'You are now participating in this Giveaway',
    left: 'You are no longer participating in this Giveaway',
    participants: 'Participants',
   },
   edit: {
    description: 'Edit a Giveaway',
    invalidTime: 'The given Time was not valid',
    noChanges: 'No valid changes were made',
    success: 'Successfully edited Giveaway',
    button: 'Get to Giveaway',
    noOptionsProvided: 'Please provide Options to change',
   },
   reroll: {
    description: 'Re-roll a Giveaway',
    rerolled: 'Successfully re-rolled Giveaway',
    button: 'Get to Giveaway',
   },
  },
 },
 nitro: {
  given: (user: CT.bEvalUser | Discord.User, roles: string, days: Strumber) =>
   `<@${user.id}> has been given\n${roles}\nfor boosting ${days} Days`,
  taken: (user: CT.bEvalUser | Discord.User, roles: string) =>
   `<@${user.id}> has been taken\n${roles}\nfrom`,
 },
 autotypes: {
  antispam: `${name} Anti-Spam`,
  antiraid: `${name} Anti-Raid`,
  antivirus: `${name} Anti-Virus`,
  blacklist: `${name} Blacklist`,
  statschannel: `${name} Stats-Channel`,
  separators: `${name} Separators`,
  autopunish: `${name} Auto-Punish`,
  selfroles: `${name} Self-Roles`,
  nitro: `${name} Nitro-Monitoring`,
  autoroles: `${name} Auto-Roles`,
 },
 mod: {
  warning: {
   text:
    'You just issued a **Moderation Command** on a User with a **Mod Role**. \nDo you want to **proceed** or **abort**.',
   proceed: 'Proceed',
   abort: 'Abort',
  },
  tempmuteAdd: {
   author: (args: CT.ModBaseEventOptions) =>
    `${args.target.username}#${args.target.discriminator} was Temp-Muted`,
   description: (args: CT.ModBaseEventOptions) =>
    `Target<@${args.target.id}>/ \`${args.target.username}#${args.target.discriminator}\` / \`${
     args.target.id
    }\`\nwas Temp-Muted by\n${
     args.executor
      ? `Executor <@${args.executor.id}> / \`${args.executor.username}#${args.executor.discriminator}\` / \`${args.executor.id}\``
      : 'unknown Executor'
    }`,
   footer: (args: CT.ModBaseEventOptions) =>
    `Executor ID ${args.executor?.id ?? 'unknown'}\nTarget ID ${args.target.id}`,
   activeMute: `Joined with an active Mute`,
   activeMuteError:
    "This User joined with an active Mute.\nHowever I wasn't able to Mute them.\nMissing Permissions",
   dm: {
    author: (args: CT.ModBaseEventOptions) =>
     `You have been Temp-Muted on \`${args.guild?.name ?? 'unknown Guild'}\``,
   },
   alreadyApplied: (args: CT.ModBaseEventOptions) =>
    `Member <@${args.target.id}> is already Temp-Muted`,
   exeNoPerms: "You can't Temp-Mute this Member",
   meNoPerms: "I can't Temp-Mute this Member `Missing Permissions`",
   success: (args: CT.ModBaseEventOptions) => `Member <@${args.target.id}> was Temp-Muted`,
   loading: 'Temp-Muting User...',
   error: "I wasn't able to Temp-Mute this User!",
   noMember: 'This User is not a Member of this Server',
   selfPunish: "You can't Temp-Mute yourself",
   mePunish: "I won't Temp-Mute myself",
   permissionError: "I don't have enough Permissions to Temp-Mute this User",
  },
  muteRemove: {
   author: (args: CT.ModBaseEventOptions) =>
    `${args.target.username}#${args.target.discriminator} was Un-Muted`,
   description: (args: CT.ModBaseEventOptions) =>
    `Target<@${args.target.id}>/ \`${args.target.username}#${args.target.discriminator}\` / \`${
     args.target.id
    }\`\nwas Un-Muted by\n${
     args.executor
      ? `Executor <@${args.executor.id}> / \`${args.executor.username}#${args.executor.discriminator}\` / \`${args.executor.id}\``
      : 'unknown Executor'
    }`,
   footer: (args: CT.ModBaseEventOptions) =>
    `Executor ID ${args.executor?.id ?? 'unknown'}\nTarget ID ${args.target.id}`,
   dm: {
    author: (args: CT.ModBaseEventOptions) =>
     `You have been Un-Muted on \`${args.guild?.name ?? 'unknown Guild'}\``,
   },
   exeNoPerms: "You can't Un-Mute this Member",
   alreadyApplied: (args: CT.ModBaseEventOptions) => `Member <@${args.target.id}> isn't muted`,
   success: (args: CT.ModBaseEventOptions) => `Member <@${args.target.id}> was Un-Mute`,
   loading: 'Un-Muting User...',
   error: "I wasn't able to Un-Mute this User!",
   noMember: 'This User is not a Member of this Server',
   mePunish: "I can't Un-Mute myself",
   selfPunish: "You can't Un-Mute yourself",
   permissionError: "I don't have enough Permissions to Un-Mute this User",
  },
  banAdd: {
   author: (args: CT.ModBaseEventOptions) =>
    `${args.target.username}#${args.target.discriminator} was Banned`,
   description: (args: CT.ModBaseEventOptions) =>
    `Target<@${args.target.id}>/ \`${args.target.username}#${args.target.discriminator}\` / \`${
     args.target.id
    }\`\nwas Banned by\n${
     args.executor
      ? `Executor <@${args.executor.id}> / \`${args.executor.username}#${args.executor.discriminator}\` / \`${args.executor.id}\``
      : 'unknown Executor'
    }`,
   footer: (args: CT.ModBaseEventOptions) =>
    `Executor ID ${args.executor?.id ?? 'unknown'}\nTarget ID ${args.target.id}`,
   dm: {
    author: (args: CT.ModBaseEventOptions) =>
     `You have been Banned from \`${args.guild?.name ?? 'unknown Guild'}\``,
   },
   exeNoPerms: "You can't Ban this User",
   permissionError: "I don't have enough Permissions to Ban this User",
   error: "I wasn't able to Ban this User!",
   alreadyApplied: (args: CT.ModBaseEventOptions) => `User <@${args.target.id}> is already Banned`,
   success: (args: CT.ModBaseEventOptions) => `User <@${args.target.id}> was Banned`,
   loading: 'Banning User...',
   selfPunish: "You can't Ban yourself",
   mePunish: "I won't Ban myself",
  },
  roleAdd: {
   author: (args: CT.ModBaseEventOptions) =>
    `${args.target.username}#${args.target.discriminator} has been added to ${args.role?.name}`,
   description: (args: CT.ModBaseEventOptions) =>
    `Target<@${args.target.id}>/ \`${args.target.username}#${args.target.discriminator}\` / \`${
     args.target.id
    }\`\nhas been added to\nRole ${args.role} / \`${args.role?.name}\` / \`${
     args.role?.id
    }\`\nby\n${
     args.executor
      ? `Executor <@${args.executor.id}> / \`${args.executor.username}#${args.executor.discriminator}\` / \`${args.executor.id}\``
      : 'unknown Executor'
    }`,
   footer: (args: CT.ModBaseEventOptions) =>
    `Executor ID ${args.executor?.id ?? 'unknown'}\nTarget ID ${args.target.id}`,
   dm: {
    author: (args: CT.ModBaseEventOptions) =>
     `You have been added to \`${args.role?.name}\` on \`${args.guild?.name ?? 'unknwon Guild'}\``,
   },
   exeNoPerms: "You can't add this User to Roles",
   permissionError: "I don't have enough Permissions to add Roles to this User",
   error: "I wasn't able to add this User to Roles!",
   alreadyApplied: (args: CT.ModBaseEventOptions) =>
    `User <@${args.target.id}> already has Role ${args.role} added`,
   success: (args: CT.ModBaseEventOptions) => `<@${args.target.id}> added to Role ${args.role}`,
   loading: 'Adding User to Role...',
   selfPunish: "You can't add yourself to Roles",
   mePunish: "I won't add myself to Roles",
  },
  roleRemove: {
   author: (args: CT.ModBaseEventOptions) =>
    `${args.target.username}#${args.target.discriminator} has been removed from ${args.role?.name}`,
   description: (args: CT.ModBaseEventOptions) =>
    `Target<@${args.target.id}>/ \`${args.target.username}#${args.target.discriminator}\` / \`${
     args.target.id
    }\`\nhas been removed from\nRole ${args.role} / \`${args.role?.name}\` / \`${
     args.role?.id
    }\`\nby\n${
     args.executor
      ? `Executor <@${args.executor.id}> / \`${args.executor.username}#${args.executor.discriminator}\` / \`${args.executor.id}\``
      : 'unknown Executor'
    }`,
   footer: (args: CT.ModBaseEventOptions) =>
    `Executor ID ${args.executor?.id ?? 'unknown'}\nTarget ID ${args.target.id}`,
   dm: {
    author: (args: CT.ModBaseEventOptions) =>
     `You have been removed from \`${args.role?.name}\` on \`${
      args.guild?.name ?? 'unknown Guild'
     }\``,
   },
   exeNoPerms: "You can't remove this User from Roles",
   permissionError: "I don't have enough Permissions to remove this User from Roles",
   error: "I wasn't able to remove this User from Roles!",
   alreadyApplied: (args: CT.ModBaseEventOptions) =>
    `User <@${args.target.id}> doesn't have Role ${args.role} added`,
   success: (args: CT.ModBaseEventOptions) => `<@${args.target.id}> removed from Role ${args.role}`,
   loading: 'Removing User from Role...',
   selfPunish: "You can't remove yourself from Roles",
   mePunish: "I won't remove myself from Roles",
  },
  softbanAdd: {
   author: (args: CT.ModBaseEventOptions) =>
    `${args.target.username}#${args.target.discriminator} was Soft-Banned`,
   description: (args: CT.ModBaseEventOptions) =>
    `Target<@${args.target.id}>/ \`${args.target.username}#${args.target.discriminator}\` / \`${
     args.target.id
    }\`\nwas Soft-Banned by\n${
     args.executor
      ? `Executor <@${args.executor.id}> / \`${args.executor.username}#${args.executor.discriminator}\` / \`${args.executor.id}\``
      : 'unknown Executor'
    }`,
   footer: (args: CT.ModBaseEventOptions) =>
    `Executor ID ${args.executor?.id ?? 'unknown'}\nTarget ID ${args.target.id}`,
   dm: {
    author: (args: CT.ModBaseEventOptions) =>
     `You have been Soft-Banned from \`${args.guild?.name ?? 'unknown Guild'}\``,
   },
   exeNoPerms: "You can't Soft-Ban this User",
   permissionError: "I don't have enough Permissions to Soft-Ban this User",
   error: "I wasn't able to Soft-Ban this User!",
   alreadyApplied: (args: CT.ModBaseEventOptions) => `User <@${args.target.id}> is already banned`,
   success: (args: CT.ModBaseEventOptions) => `User <@${args.target.id}> was Soft-Banned`,
   loading: 'Soft-Banning User...',
   selfPunish: "You can't Soft-Ban yourself",
   mePunish: "I won't Soft-Ban myself",
   unbanReason: 'Soft-Ban',
  },
  tempbanAdd: {
   author: (args: CT.ModBaseEventOptions) =>
    `${args.target.username}#${args.target.discriminator} was Temp-Banned`,
   description: (args: CT.ModBaseEventOptions) =>
    `Target<@${args.target.id}>/ \`${args.target.username}#${args.target.discriminator}\` / \`${
     args.target.id
    }\`\nwas Temp-Banned by\n${
     args.executor
      ? `Executor <@${args.executor.id}> / \`${args.executor.username}#${args.executor.discriminator}\` / \`${args.executor.id}\``
      : 'unknown Executor'
    }`,
   footer: (args: CT.ModBaseEventOptions) =>
    `Executor ID ${args.executor?.id ?? 'unknown'}\nTarget ID ${args.target.id}`,
   dm: {
    author: (args: CT.ModBaseEventOptions) =>
     `You have been Temp-Banned from \`${args.guild?.name ?? 'unknown Guild'}\``,
   },
   exeNoPerms: "You can't Temp-Ban this User",
   permissionError: "I don't have enough Permissions to Temp-Ban this User",
   error: "I wasn't able to Temp-Ban this User!",
   alreadyApplied: (args: CT.ModBaseEventOptions) =>
    `User <@${args.target.id}> is already Temp-Banned`,
   success: (args: CT.ModBaseEventOptions) => `User <@${args.target.id}> was Temp-Banned`,
   loading: 'Temp-Banning User...',
   selfPunish: "You can't Temp-Ban yourself",
   mePunish: "I won't Temp-Ban myself",
  },
  channelbanAdd: {
   author: (args: CT.ModBaseEventOptions) =>
    `${args.target.username}#${args.target.discriminator} was Channel-Banned from ${
     args.channel?.name ?? 'an unknown Channel'
    }`,
   description: (args: CT.ModBaseEventOptions) =>
    `Target<@${args.target.id}>/ \`${args.target.username}#${args.target.discriminator}\` / \`${
     args.target.id
    }\`\nwas was Channel-Banned from\n${
     args.channel
      ? `Channel <#${args.channel.id}> / \`${args.channel.name}\` / \`${args.channel.id}\``
      : 'unkown Channel'
    }\nby\n${
     args.executor
      ? `Executor <@${args.executor.id}> / \`${args.executor.username}#${args.executor.discriminator}\` / \`${args.executor.id}\``
      : 'unknown Executor'
    }`,
   footer: (args: CT.ModBaseEventOptions) =>
    `Executor ID ${args.executor?.id ?? 'unknown'}\nTarget ID ${args.target.id}`,
   dm: {
    author: (args: CT.ModBaseEventOptions) =>
     `You have been Channel-Banned in \`${args.guild?.name ?? 'unknown Guild'}\``,
   },
   exeNoPerms: "You can't Channel-Ban this User",
   permissionError: "I don't have enough Permissions to Channel-Ban this User",
   error: "I wasn't able to Channel-Ban this User!",
   alreadyApplied: (args: CT.ModBaseEventOptions) =>
    `User <@${args.target.id}> is already Channel-Banned`,
   success: (args: CT.ModBaseEventOptions) => `User <@${args.target.id}> was Channel-Banned`,
   loading: 'Channel-Banning User...',
   selfPunish: "You can't Channel-Ban yourself",
   mePunish: "I won't Channel-Ban myself",
  },
  tempchannelbanAdd: {
   author: (args: CT.ModBaseEventOptions) =>
    `${args.target.username}#${args.target.discriminator} was Temp-Channel-Banned from ${
     args.channel?.name ?? 'unkown Channel'
    }`,
   description: (args: CT.ModBaseEventOptions) =>
    `Target<@${args.target.id}>/ \`${args.target.username}#${args.target.discriminator}\` / \`${
     args.target.id
    }\`\nwas was Temp-Channel-Banned from\n${
     args.channel
      ? `Channel <#${args.channel.id}> / \`${args.channel.name}\` / \`${args.channel.id}\``
      : 'unkown Channel'
    }\nby\n${
     args.executor
      ? `Executor <@${args.executor.id}> / \`${args.executor.username}#${args.executor.discriminator}\` / \`${args.executor.id}\``
      : 'unknown Executor'
    }`,
   footer: (args: CT.ModBaseEventOptions) =>
    `Executor ID ${args.executor?.id ?? 'unknown'}\nTarget ID ${args.target.id}`,
   dm: {
    author: (args: CT.ModBaseEventOptions) =>
     `You have been Temp-Channel-Banned in \`${args.guild?.name ?? 'unknown Guild'}\``,
   },
   exeNoPerms: "You can't Temp-Channel-Ban this User",
   permissionError: "I don't have enough Permissions to Temp-Channel-Ban this User",
   error: "I wasn't able to Temp-Channel-Ban this User!",
   alreadyApplied: (args: CT.ModBaseEventOptions) =>
    `User <@${args.target.id}> is already Channel-Banned`,
   success: (args: CT.ModBaseEventOptions) => `User <@${args.target.id}> was Temp-Channel-Banned`,
   loading: 'Temp-Channel-Banning User...',
   selfPunish: "You can't Temp-Channel-Ban yourself",
   mePunish: "I won't Temp-Channel-Ban myself",
  },
  channelbanRemove: {
   author: (args: CT.ModBaseEventOptions) =>
    `${args.target.username}#${args.target.discriminator} was Channel-Unbanned from ${
     args.channel?.name ?? 'unkown Channel'
    }`,
   description: (args: CT.ModBaseEventOptions) =>
    `Target<@${args.target.id}>/ \`${args.target.username}#${args.target.discriminator}\` / \`${
     args.target.id
    }\`\nwas Channel-Unbanned from\n${
     args.channel
      ? `Channel <#${args.channel.id}> / \`${args.channel.name}\` / \`${args.channel.id}\``
      : 'unkown Channel'
    }\nby\n${
     args.executor
      ? `Executor <@${args.executor.id}> / \`${args.executor.username}#${args.executor.discriminator}\` / \`${args.executor.id}\``
      : 'unknown Executor'
    }`,
   footer: (args: CT.ModBaseEventOptions) =>
    `Executor ID ${args.executor?.id ?? 'unknown'}\nTarget ID ${args.target.id}`,
   dm: {
    author: (args: CT.ModBaseEventOptions) =>
     `You have been Channel-Unbanned in \`${args.guild?.name ?? 'unknown Guild'}\``,
   },
   exeNoPerms: "You can't Channel-Unbanned this User",
   permissionError: "I don't have enough Permissions to Channel-Unbanned this User",
   error: "I wasn't able to Channel-Unbanned this User!",
   alreadyApplied: (args: CT.ModBaseEventOptions) =>
    `User <@${args.target.id}> isn't Channel-Banned`,
   success: (args: CT.ModBaseEventOptions) => `User <@${args.target.id}> was Channel-Unbanned`,
   loading: 'Channel-Unbanning User...',
   selfPunish: "You can't Channel-Unban yourself",
   mePunish: "I won't Channel-Unban myself",
  },
  banRemove: {
   author: (args: CT.ModBaseEventOptions) =>
    `${args.target.username}#${args.target.discriminator} was Un-Banned`,
   description: (args: CT.ModBaseEventOptions) =>
    `Target<@${args.target.id}>/ \`${args.target.username}#${args.target.discriminator}\` / \`${
     args.target.id
    }\`\nwas Un-Banned by\n${
     args.executor
      ? `Executor <@${args.executor.id}> / \`${args.executor.username}#${args.executor.discriminator}\` / \`${args.executor.id}\``
      : 'unknown Executor'
    }`,
   footer: (args: CT.ModBaseEventOptions) =>
    `Executor ID ${args.executor?.id ?? 'unknown'}\nTarget ID ${args.target.id}`,
   dm: {
    author: (args: CT.ModBaseEventOptions) =>
     `You have been Un-Banned from \`${args.guild?.name ?? 'unknown Guild'}\``,
   },
   exeNoPerms: "You can't Un-Ban this User",
   permissionError: "I don't have enough Permissions to Un-Ban this User",
   error: "I wasn't able to Un-Ban this User!",
   alreadyApplied: (args: CT.ModBaseEventOptions) => `User <@${args.target.id}> isn't banned`,
   success: (args: CT.ModBaseEventOptions) => `User <@${args.target.id}> was Un-Banned`,
   loading: 'Un-Banning User...',
   selfPunish: "You can't Un-Ban yourself",
   mePunish: "I won't Un-Ban myself",
  },
  kickAdd: {
   author: (args: CT.ModBaseEventOptions) =>
    `${args.target.username}#${args.target.discriminator} was Kicked`,
   description: (args: CT.ModBaseEventOptions) =>
    `Target<@${args.target.id}>/ \`${args.target.username}#${args.target.discriminator}\` / \`${
     args.target.id
    }\`\nwas Kicked by\n${
     args.executor
      ? `Executor <@${args.executor.id}> / \`${args.executor.username}#${args.executor.discriminator}\` / \`${args.executor.id}\``
      : 'unknown Executor'
    }`,
   footer: (args: CT.ModBaseEventOptions) =>
    `Executor ID ${args.executor?.id ?? 'unknown'}\nTarget ID ${args.target.id}`,
   dm: {
    author: (args: CT.ModBaseEventOptions) =>
     `You have been Kicked from \`${args.guild?.name ?? 'unknown Guild'}\``,
   },
   exeNoPerms: "You can't Kick this Member",
   alreadyApplied: (args: CT.ModBaseEventOptions) =>
    `User <@${args.target.id}> is not a Member of this Server`,
   permissionError: "I don't have enough Permissions to Kick this Member",
   error: "I wasn't able to Kick this Member!",
   success: (args: CT.ModBaseEventOptions) => `User <@${args.target.id}> was Kicked`,
   loading: 'Kicking User...',
   selfPunish: "You can't Kick yourself",
   mePunish: "I won't Kick myself",
  },
  warnAdd: {
   dm: {
    author: (args: CT.ModBaseEventOptions) =>
     `You have been Warned on the Server \`${args.guild?.name ?? 'unknown Guild'}\``,
   },
   footer: (args: CT.ModBaseEventOptions) =>
    `Executor ID ${args.executor?.id ?? 'unknown'}\nTarget ID ${args.target.id}`,
   author: (args: CT.ModBaseEventOptions) =>
    `${args.target.username}#${args.target.discriminator} was Warned`,
   description: (args: CT.ModBaseEventOptions) =>
    `Target<@${args.target.id}>/ \`${args.target.username}#${args.target.discriminator}\` / \`${
     args.target.id
    }\`\nwas Warned by\n${
     args.executor
      ? `Executor <@${args.executor.id}> / \`${args.executor.username}#${args.executor.discriminator}\` / \`${args.executor.id}\``
      : 'unknown Executor'
    }`,
   exeNoPerms: "You can't Warn this Member",
   antispam: '**Please stop Spamming**',
   antivirus: '**Please do not post Malicious Links**',
   blacklist: '**Please do not send Blacklisted Words**\nCheck your DMs for a List of them',
   success: (args: CT.ModBaseEventOptions) => `User <@${args.target.id}> was Warned`,
   loading: 'Warning User...',
   selfPunish: "You can't Warn yourself",
   mePunish: "I won't Warn myself",
  },
  softwarnAdd: {
   dm: {
    author: (args: CT.ModBaseEventOptions) =>
     `You have been Soft-Warned on the Server \`${args.guild?.name ?? 'unknown Guild'}\``,
   },
   footer: (args: CT.ModBaseEventOptions) =>
    `Executor ID ${args.executor?.id ?? 'unknown'}\nTarget ID ${args.target.id}`,
   author: (args: CT.ModBaseEventOptions) =>
    `${args.target.username}#${args.target.discriminator} was Soft-Warned`,
   description: (args: CT.ModBaseEventOptions) =>
    `Target<@${args.target.id}>/ \`${args.target.username}#${args.target.discriminator}\` / \`${
     args.target.id
    }\`\nwas Soft-Warned by\n${
     args.executor
      ? `Executor <@${args.executor.id}> / \`${args.executor.username}#${args.executor.discriminator}\` / \`${args.executor.id}\``
      : 'unknown Executor'
    }`,
   exeNoPerms: "You can't Soft-Warn this Member",
   success: (args: CT.ModBaseEventOptions) => `User <@${args.target.id}> was Soft-Warned`,
   loading: 'Soft-Warning User...',
   selfPunish: "You can't Soft-Warn yourself",
   mePunish: "I won't Soft-Warn myself",
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
 antivirus: {
  whitelisted: (tick: string) => `${tick} This Link is __not__ Malicious`,
  checking: 'Link:',
  VTfail: (cross: string) => `${cross} Failed to analyze Link`,
  malicious: (cross: string) => `${cross} This Link __is__ Malicious`,
  newLink: (cross: string) => `${cross} Link is __most likely__ Malicious`,
  notexistent: (url: string) => `The Domain \`${url}\` does not exist (anymore)`,
  ccscam: (cross: string) =>
   `${cross} This Link __is__ Malicious\nIt try to gain access to your Credit Card Information`,
  cfProtected:
   "The Intent of this Website couldn't be determined\nas it is CloudFlare protected\n**Proceed with Caution**",
  timedOut:
   "The Operation timed out, after 180 Seconds without response.\nThe Intent of this Website couldn't be determined\n**Proceed with Caution**",
  log: {
   value: (msg: Discord.Message) =>
    `User <@${msg.author.id}> / \`${msg.author.username}#${msg.author.discriminator}\` / \`${
     msg.author.id
    }\`\nposted this Link in\nChannel <#${msg.channel.id}> / \`${
     'name' in msg.channel ? msg.channel.name : 'Unknown'
    }\` / \`${msg.channel.id}\``,
   href: 'Hyperlink Reference',
   url: 'URL',
   hostname: 'URL Hostname',
   baseURL: 'Base URL',
   baseURLhostname: 'Base URL Hostname',
   author: `${name} Link Log`,
  },
 },
 errors: {
  userNotExist: 'The Mentioned User does not exist',
  userNotFound: 'The Mentioned User could not be found',
  serverNotFound: 'The Mentioned Server could not be found',
  inviteNotFound: 'The Mentioned Invite could not be found',
  channelNotFound: 'The Mentioned Channel could not be found',
  numTooLarge: 'Number too large',
  numNaN: 'Not a Number',
  guildCommand: 'This Command is only available in Servers',
  memberNotFound: 'Member not found',
  notAvailableAPI: 'This Command is not yet available due to Discord API limitations',
  sendMessage: 'I cannot send Messages in this Channel',
  lackingAccess: (emotes: string) => `I'm lacking access to these emotes: ${emotes}`,
  channelNotManageable: "I'm lacking Permissions to edit that Channel",
  roleNotFound: 'Role not Found',
  notYours: "You can't interact with someone elses Messages",
  time: 'Time ran out',
  noGuildFound: 'No Server found, please report to the Support Server',
  noChannelFound: 'No Channel found, please report to the Support Server',
  noRoleFound: 'No Role found, please report to the Support Server',
  noThreadCanBeCreated: 'In this Channel, private Threads cannot be created',
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
 antiraid: {
  banAdd: {
   author: (amount: Strumber) => `${amount} Users were Banned by ${name} Anti-Raid`,
  },
  kickAdd: {
   author: (amount: Strumber) => `${amount} Users were Kicked by ${name} Anti-Raid`,
  },
 },
 userFlags: {
  Staff: 'Discord Employee',
  DiscordEmployee: 'Discord Employee',
  PartneredServerOwner: 'Partnered Server Owner',
  Partner: 'Partnered Server Owner',
  Hypesquad: 'Hype Squad Events Member',
  HypesquadEvents: 'Hype Squad Events Member',
  HypeSquadEventsMember: 'Hype Squad Events Member',
  BughunterLevel1: 'Bug Hunter Level 1',
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
  BughunterLevel2: 'Bug Hunter Level 2',
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
  NEWS: 'Can create news Channels',
  NEW_THREAD_PERMISSIONS: 'Has access to new Thread Permissions',
  PARTNERED: 'Is officially Partnered with Discord',
  PREMIUM_TIER_3_OVERRIDE: 'Has access to Server Boost Level 3 Features bypassing Server Boosts',
  PREVIEW_ENABLED: 'Can be Previewed before joining',
  RAID_ALERTS_ENABLED: 'Has Raid Alerts enabled',
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
  TEXT_IN_STAGE_ENABLED: 'Has enabled Text in stage Channels',
  TEXT_IN_VOICE_ENABLED: 'Has enabled Text in voice Channels',
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
  VIP_REGIONS: 'Has access to 384kbps voice Channels',
  VOICE_CHANNEL_EFFECTS: 'Has previously participated in the voice Channel Effects Experiment',
  VOICE_IN_THREADS: 'Can send Voice Messages in Threads',
  WELCOME_SCREEN_ENABLED: 'Has welcome Screen enabled',
  // DEPRECATED
  CHANNEL_BANNER: 'Can set Channel Banners (Deprecated)',
  COMMERCE: 'Can create Store Channels (Deprecated)',
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
   role: "I can't manage this Role",
   you: 'You are missing Permissions to execute this Command',
  },
  perms: {
   CreateInstantInvite: 'Create Instant Invite',
   KickMembers: 'Kick Members',
   BanMembers: 'Ban Members',
   Administrator: 'Administrator',
   ManageChannel: 'Manage Channel',
   ManageChannels: 'Manage Channels',
   ManageGuild: 'Manage Guild/Server',
   AddReactions: 'Add Reactions',
   ViewAuditLog: 'View Audit Log',
   PrioritySpeaker: 'Priority Speaker',
   Stream: 'Stream',
   ReadMessages: 'Read Messages',
   ViewChannel: 'View Channel',
   ViewChannels: 'View Channels',
   SendMessages: 'Send Messages',
   SendTTSMessages: 'Send TTS Messages',
   ManageMessages: 'Manage Messages',
   EmbedLinks: 'Embed Links',
   AttachFiles: 'Attach Files',
   ReadMessageHistory: 'Read Message History',
   MentionEveryone: 'Mention Everyone',
   UseExternalEmojis: 'Use External Emojis',
   ViewGuildInsights: 'View Guild/Server Insights',
   Connect: 'Connect',
   Speak: 'Speak',
   MuteMembers: 'Mute Members',
   DeafenMembers: 'Deafen Members',
   MoveMembers: 'Move Members',
   UseVAD: 'Use Voice Activity Detection',
   ChangeNickname: 'Change Nickname',
   ManageNicknames: 'Manage Nicknames',
   ManageRoles: 'Manage Roles',
   ManageWebhooks: 'Manage Webhooks',
   ManageEmojisAndStickers: 'Manage Emojis and Stickers',
   UseApplicationCommands: 'Use Application Commands',
   RequestToSpeak: 'Request to Speak',
   ManageThreads: 'Manage Threads',
   CreatePublicThreads: 'Create Public Threads',
   CreatePrivateThreads: 'Create Private Threads',
   UseExternalStickers: 'Use External Stickers',
   SendMessagesInThreads: 'Send Messages in Threads',
   UseEmbeddedActivities: 'Start Embedded Activities',
   ModerateMembers: 'Moderate Members',
   ManageEvents: 'Manage Events',
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
 },
 commandTypes: {
  slashCommands: 'Slash Commands',
  textCommands: 'Text Commands',
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
 welcome: (user: CT.bEvalUser | Discord.User, guild: Discord.Guild) =>
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
  'application.commands': 'Use Slash Commands',
  'applicaiton.commands.update': 'Update Slash Commands',
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
};
