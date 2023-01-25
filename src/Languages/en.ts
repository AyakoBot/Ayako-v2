import type * as Discord from 'discord.js';
import type CT from '../Typings/CustomTypings';
import client from '../BaseClient/Client.js';

type Strumber = string | number;

const getUser = (user: Discord.User) =>
  `${user.bot ? 'Bot' : 'User'} <@${user.id}> / \`${user.username}#${user.discriminator}\` / \`${
    user.id
  }\`\n`;

const getAutoModerationRule = (rule: Discord.AutoModerationRule) =>
  `Auto-Moderation Rule \`${rule.name}\` / \`${rule.id}\`\n`;

const getMessage = (msg: Discord.Message | Discord.MessageReference) =>
  `[This Message](${client.ch.getJumpLink(msg)})\n`;

const getChannel = (
  channel:
    | Discord.Channel
    | Discord.GuildChannel
    | Discord.ThreadChannel
    | Discord.APIPartialChannel
    | undefined,
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
  `${client.customConstants.standard.getEmote(emoji)} / \`${emoji.name ?? 'None'}\` / \`${
    emoji.id ?? 'None'
  }\`\n`;

const getInviteDetails = (invite: Discord.Invite, user?: Discord.User) =>
  `Code: \`${invite.code}\`\n${user ? `Inviter: ${getUser(user)}` : ''}Uses: ${
    invite.uses
  }\nCreated: ${
    invite.createdAt
      ? client.customConstants.standard.getTime(invite.createdAt.getTime())
      : 'unknown'
  }`;

const getInvite = (invite: Discord.Invite) =>
  `Invite discord.gg/${invite.code} / \`${invite.code}\`\n`;

const getIntegration = (integration: Discord.Integration) =>
  `Integration \`${integration.name}\` / \`${integration.id}\`\n`;

const getRole = (role: Discord.Role) => `Role <@&${role}> / \`${role.name}\` / \`${role.id}\`\n`;

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

const getSticker = (sticker: Discord.Sticker) => `Sticker \`${sticker.name}\` / \`${sticker.id}\``;

export default {
  languageFunction: {
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
        descUpdateAudit: (
          application: Discord.User,
          user: Discord.User,
          command: Discord.ApplicationCommand,
        ) =>
          `${getUser(user)}has updated Permissions of\n${getCommand(command)}from\n${getApplication(
            application as unknown as Discord.Application,
          )}`,
        descUpdate: (application: Discord.User, command: Discord.ApplicationCommand) =>
          `The Permissions\n${getCommand(command)}from\n${getApplication(
            application as unknown as Discord.Application,
          )}were updated`,
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
        descDelete: (event: Discord.GuildScheduledEvent) =>
          `${getScheduledEvent(event)}was deleted`,
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
        descCreate: (event: Discord.GuildScheduledEvent) =>
          `${getScheduledEvent(event)}was created`,
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
        ) => `${getScheduledEvent(event)}has updated from\n${getChannel(channel, channelType)}`,
        descUpdate: (event: Discord.GuildScheduledEvent) =>
          `${getScheduledEvent(event)}was updated`,
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
          2: 'ACtive',
          3: 'Completed',
          4: 'Canceled',
        },
        privacyLevelName: 'Privacy Level',
        privacyLevel: {
          1: 'Public',
          2: 'Guild Only',
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
        descUpdate: (
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
        selfStream: 'Streaming enabled',
        selfVideo: 'Camera enabled',
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
        ) =>
          `${getWebhook(webhook, webhookType)}was created in\n${getChannel(channel, channelType)}`,
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
        ) =>
          `${getWebhook(webhook, webhookType)}in\n${getChannel(channel, channelType)}was deleted`,
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
      },
      reaction: {
        descAdded: (emoji: Discord.Emoji, user: Discord.User, msg: Discord.Message) =>
          `${getUser(user)}has reacted with\n${getEmote(emoji)}to ${getMessage(msg)}`,
        descRemoved: (emoji: Discord.Emoji, user: Discord.User, msg: Discord.Message) =>
          `Reaction on\n${getMessage(msg)}with ${getEmote(emoji)}by ${getUser(
            user,
          )}was removed,\neither by the reactor themself or by a Moderator`,
        descRemovedAll: (msg: Discord.Message) =>
          `All Reactions on\n${getMessage(msg)}were removed`,
        descRemoveEmoji: (msg: Discord.Message, emoji: Discord.Emoji) =>
          `Reaction with\n${getEmote(emoji)}was removed from\n${getMessage(msg)}`,
        nameRemoveAll: 'Reaction remove All',
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
        beforeContent: 'Content before:',
        afterContent: 'Content after:',
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
        descCreate: (integration: Discord.Integration) =>
          `${getIntegration(integration)}was created`,
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
        descUpdate: (integration: Discord.Integration) =>
          `${getIntegration(integration)}was updated`,
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
        descBotLeave: (user: Discord.User) => `${getUser(user)}has left`,
        descBotLeaveAudit: (user: Discord.User, executor: Discord.User) =>
          `${getUser(executor)}has kicked\n${getUser(user)}`,
        descMemberLeave: (user: Discord.User) => `${getUser(user)}has left`,
        descMemberLeaveAudit: (user: Discord.User, executor: Discord.User) =>
          `${getUser(executor)}has kicked\n${getUser(user)}`,
        descBotUpdate: (user: Discord.User) => `${getUser(user)}was updated`,
        descBotUpdateAudit: (user: Discord.User, executor: Discord.User) =>
          `${getUser(executor)}has updated\n${getUser(user)}`,
        descMemberUpdate: (user: Discord.User) => `${getUser(user)}was updated`,
        descMemberUpdateAudit: (user: Discord.User, executor: Discord.User) =>
          `${getUser(executor)}has updated\n${getUser(user)}`,
        descGuildUpdate: () => `The Server was updated`,
        descGuildUpdateAudit: (executor: Discord.User) =>
          `${getUser(executor)}has updated the Server`,
        memberJoin: 'Member joined',
        botJoin: 'Bot joined',
        ban: 'User banned',
        unban: 'User un-banned',
        emojiCreate: 'Emoji created',
        emojiDelete: 'Emoji deleted',
        emojiUpdate: 'Emoji updated',
        invite: 'Invite',
        botKick: 'Bot kicked',
        memberKick: 'Member kicked',
        memberUpdate: 'Member updated',
        botUpdate: 'Bot updated',
        avatar: 'Avatar',
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
        widgetChannelId: 'Widget Channel',
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
          0: 'None',
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
        toggles: {
          ANIMATED_BANNER: 'Server can set an animated Banner',
          ANIMATED_ICON: 'Server can set an animated Icon',
          APPLICATION_COMMAND_PERMISSIONS_V2: 'Server uses Application Command Permissisons V2',
          AUTO_MODERATION: 'Server has Auto-Moderation enabled',
          BANNER: 'Server can set a Banner',
          COMMUNITY: 'Server is a community Server',
          CREATOR_MONETIZABLE_PROVISIONAL: 'Server has Monetization enabled',
          CREATOR_STORE_PAGE: 'Server has enabled the Role Subscription Promo Page',
          DEVELOPER_SUPPORT_SERVER: 'Server is a Developer Support Server',
          DISCOVERABLE: 'Server is discoverable in Server Discovery',
          FEATURABLE: 'Server is featurable in the Directory',
          HAS_DIRECTORY_ENTRY: 'Server is listed in a Directory Channel',
          HUB: 'Server is a Student Hub',
          INVITE_SPLASH: 'Server has access to set an Invite Splash Background',
          INVITES_DISABLED: 'Server has Invites disabled',
          LINKED_TO_HUB: 'Server is a Student Hub',
          MEMBER_VERIFICATION_GATE_ENABLED: 'Server has enabled Membership Screening',
          MONETIZATION_ENABLED: 'Server has Monetization enabled',
          MORE_STICKERS: 'Server has increased custom Sticker Slots',
          NEWS: 'Server has access to create a News/Announcement Channel',
          PARTNERED: 'Server is partnered',
          PREVIEW_ENABLED: 'Server can be previewed',
          PRIVATE_THREADS: 'Server has access to Private Threads',
          RELAY_ENABLED: 'Relay Enabled',
          ROLE_ICONS: 'Server can set Role Icons',
          ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE:
            'Server has Role Subscriptions that can be purchased',
          ROLE_SUBSCRIPTIONS_ENABLED: 'Server has enabled Role Subscriptions',
          TICKETED_EVENTS_ENABLED: 'Server has enabled Ticketed Events',
          VIP_REGIONS: 'Server has access to 384kpbs Voice Servers',
          VANITY_URL: 'Server has access to Vanity URL',
          VERIFIED: 'Server is verified',
          WELCOME_SCREEN_ENABLED: 'Server has the welcome Screen enabled',
        },
        systemChannelFlagsNameRemoved: 'Disabled System Channel Features',
        systemChannelFlagsNameAdded: 'Enabled System Channel Features',
        systemChannelFlags: {
          SuppressJoinNotifications: 'Supress Join Notifications',
          SuppressPremiumSubscriptions: 'Supress Boost Notifications',
          SuppressGuildReminderNotifications: 'Supress Server Reminder Notifications',
          SuppressJoinNotificationReplies: 'Supress Join Notification Sticker Reactions',
        },
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
          `${getUser(user)}has pinned\n${getMessage(msg)}in\n${getChannel(
            msg.channel,
            channelType,
          )}`,
        descPinCreate: (msg: Discord.Message, channelType: string) =>
          `${getMessage(msg)}was pinned in\n${getChannel(msg.channel, channelType)}`,
        descPinRemoveAudit: (user: Discord.User, msg: Discord.Message, channelType: string) =>
          `${getUser(user)}has un-pinned\n${getMessage(msg)}in\n${getChannel(
            msg.channel,
            channelType,
          )}`,
        descPinRemove: (msg: Discord.Message, channelType: string) =>
          `${getMessage(msg)}was un-pinned in\n${getChannel(msg.channel, channelType)}`,
        descTyping: (
          user: Discord.User,
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
        topic: 'Description',
        flagsName: 'Flags',
        flags: {
          Pinned: 'Pinned to Top of Forum',
          RequireTag: 'Requires a Tag',
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
        autoArchiveDuration: 'Auto-Archive Duration',
        type: 'Channel Type',
        permissionOverwrites: 'Permission Overwrites',
        parentChannel: 'Parent Category',
        newlyCreated: 'Newly Created',
        archiveTimestamp: 'Archive Time',
        deniedPermissions: 'Denied Permissions',
        grantedPermissions: 'Granted Permissions',
        removedPermissions: 'Removed Permissions',
        updatedPermissions: 'Updated Permissions',
        deniedPermissionsFor: 'Denied Permission for',
        grantedPermissionFor: 'Granted Permission for',
        removedPermissionsFor: 'Removed Permissions for',
        updatedPermissionFor: 'Updated Permission for',
        unknownPermission: 'Unknown Permission Updates have been made',
        unknownPermissionFix: 'Grant `View Audit` or `Administrator` to fix this issue',
      },
      userUpdate: {
        name: 'User updated',
        desc: (user: Discord.User) => `${getUser(user)}has updated`,
        avatar: 'Avatar',
        flags: 'Badges',
        discriminator: 'Tag',
        username: 'Username',
      },
      automodActionExecution: {
        name: 'Auto-Moderation Rule enforced',
        descMessage: (rule: Discord.AutoModerationRule, msg: Discord.Message, user: Discord.User) =>
          `${getAutoModerationRule(rule)}was enforced on\nthis ${getMessage(msg)}from\n${getUser(
            user,
          )}`,
        desc: (rule: Discord.AutoModerationRule, user: Discord.User) =>
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
        descCreate: (user: Discord.User, rule: Discord.AutoModerationRule) =>
          `${getUser(user)}created\n${getAutoModerationRule(rule)}`,
        descDelete: (user: Discord.User, rule: Discord.AutoModerationRule) =>
          `${getUser(user)}deleted\n${getAutoModerationRule(rule)}`,
        descUpdate: (user: Discord.User, rule: Discord.AutoModerationRule) =>
          `${getUser(user)}updated\n${getAutoModerationRule(rule)}`,
        name: 'Auto-Moderation Rule created',
        keywordFilter: 'Triggering Keywords',
        presetsName: 'Used Preset',
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
      rrReason: 'Ayako Reaction Roles',
    },
    messageReactionRemove: {
      rrReason: 'Ayako Reaction Roles',
    },
    guildMemberUpdate: {
      boostingStart: `Member Started Boosting`,
      boostingEnd: `Member Stopped Boosting`,
      descriptionBoostingStart: (user: Discord.User) =>
        `User <@${user.id}> / \`${user.username}#${user.discriminator}\` / \`${user.id}\`\nhas started Boosting the Server`,
      descriptionBoostingEnd: (user: Discord.User) =>
        `User <@${user.id}> / \`${user.username}#${user.discriminator}\` / \`${user.id}\`\nhas stopped Boosting the Server`,
    },
    ready: {
      channelunban: `Automatically Channel-Unbanned`,
      unban: `Automatically Un-Banned`,
      unmute: `Automatically Un-Muted`,
      disboard: {
        desc: `You can now Bump this Server again!\n\nPlease type </bump:947088344167366698>`,
        title: `Ayako DISBOARD Bump Reminder`,
      },
      reminder: {
        description: `Your reminder is due!`,
        failedMsg: (channel: { id: bigint }) =>
          `I tried to send a Message in the Channel you set the Reminder in <#${channel.id}>, but I failed.`,
      },
      vote: {
        author: `12 Hours are over!`,
        description: (votegain: Strumber) =>
          `If you want to keep your multiplier streak up, ([click and vote](https://top.gg/bot/650691698409734151/vote))\nYour multiplyer is currently ${votegain}x`,
      },
      nitro: {
        gotRole: (user: Discord.User, role: Discord.Role, days: Strumber) =>
          `<@${user.id}> has been given the <@&${role.id}> role for boosting longer than ${days} days`,
      },
    },
    vote: {
      bot: (user: Discord.User, bot: Discord.User) =>
        `Thanks to ${user.discriminator} for voting for ${bot.username}!`,
      guild: (user: Discord.User, guild: Discord.Guild) =>
        `Thanks to ${user.discriminator} for voting for ${guild.name}!`,
      reward: (reward: string) => `\nYou have received ${reward} for the next 12 hours.`,
      xpmultiplier: 'XP Multiplier',
      botReason: (bot: Discord.User) => `Voted for ${bot.username}`,
      guildReason: (guild: Discord.Guild) => `Voted for ${guild.name}`,
      endReason: 'Vote ran out',
      reminder: {
        name: 'You can vote again!',
        descBot: (bot: Discord.User) => `Your Vote time-out for \`${bot.tag}\` has ended`,
        descGuild: (guild: Discord.Guild) => `Your Vote time-out for \`${guild.name}\` has ended`,
        voteBot: (bot: Discord.User) =>
          `[Click here to Vote again](https://top.gg/bot/${bot.id}/vote)`,
        voteGuild: (guild: Discord.Guild) =>
          `[Click here to Vote again](https://top.gg/servers/${guild.id}/vote)`,
        voteBotButton: (bot: Discord.User) => `Vote for ${bot.username}`,
        voteGuildButton: (guild: Discord.Guild) => `Vote for ${guild.name}`,
        voteAyakoButton: `Vote for ${client.user?.username}`,
        disable: 'Disable all Vote Reminders',
      },
    },
  },
  systemChannelFlags: {
    SuppressJoinNotifications: `\`Suppress Member join Notifications\``,
    SuppressPremiumSubscriptions: `\`Suppress Server Boost Notifications\``,
    SuppressGuildReminderNotifications: `\`Suppress Server Setup Tips\``,
    SuppressJoinNotificationReplies: `\`Hide Member join Sticker reply Buttons\``,
  },
  channelTypes: {
    0: `Text Channel`,
    1: `DM Channel`,
    2: `Voice Channel`,
    3: `Group DM Channel`,
    4: `Category`,
    5: `Announcements Channel`,
    6: `Store Channel`,
    10: `Public Thread Channel`,
    11: `Public Thread Channel`,
    12: `Private Thread Channel`,
    13: `Stage Channel`,
    14: `Directory Channel`,
    15: `Forum Channel`,
  },
  verification: {
    title: `Ayako Verification`,
    verify: `Verify`,
    checkDMs: `Verification Started, please Check our DMs`,
    startchannelmessage: `Please **open your DMs** so I can DM you a verification Captcha.\nAfter you opened them, press the Button below to re-/start Verification!.`,
    description: (guild: Discord.Guild) =>
      `<a:AMtoiletspin:709805618030182510> **Welcome to \`${guild.name}\`!**`,
    finishDesc: `**Thank you for verifying!**\nVerification Finished!`,
    kickMsg: (guild: Discord.Guild) =>
      `You have been kicked from \`${guild.name}\` because you didn't verify.\nYou can rejoin anytime with a valid Invite Link`,
    hintmsg: `Type out the traced colored Characters from left to right ➡️\nIgnore all gray decoy Characters\nIgnore Character Cases (upper & lower case)\nThe captcha contains 5 digits`,
    kickReason: `Ayako Verification | Unverified for too long`,
    openDMs: (user: Discord.User) =>
      `<@${user.id}> **Please open your DM's** in order to verify as human. Then press the Button above to re-/start Verification.\n**You can close your DM's afterwards**.`,
    wrongInput: (solution: string) =>
      `That was wrong... Are you a robot?.\nThe solution was \`${solution}\`\nI added a new Image to the Embed above, try again!`,
    timeError: (channel: Discord.Channel) =>
      `Time ran out for this Verification\nPlease go to <#${channel.id}> and press the \`Verify\` Botton to re-/start verification`,
    alreadyVerified: `You are already verified`,
    log: {
      start: (user: Discord.User) =>
        `User <@${user.id}> /\`${user.username}#${user.discriminator}\` / \`${user.id}\`\nstarted Verification`,
      end: (user: Discord.User) =>
        `User <@${user.id}> / \`${user.username}#${user.discriminator}\` / \`${user.id}\`\nfinished Verification`,
    },
    error: `An error occured while verifying! I have reported this to the Devs. Please re-try verifying`,
  },
  time: {
    seconds: `Second(s)`,
    minutes: `Minute(s)`,
    hours: `Hour(s)`,
    days: `Day(s)`,
    weeks: `Week(s)`,
    months: `Month(s)`,
    years: `Year(s)`,
    timeAgo: (time: string) => `${time} ago`,
    timeIn: (time: string) => `in ${time}`,
  },
  expire: {
    punishmentIssue: `Punishment was issued at`,
    punishmentOf: (target: Discord.User) =>
      `A Punishment of ${target.username}#${target.discriminator} has expired`,
    punishmentIn: `Punished in`,
    punishmentBy: `Punished by`,
    end: `Punishment End`,
    endedAt: (time: string) => `Punishment ended ${time}`,
    duration: `Punishment Duration`,
    pardonedBy: `Pardoned by`,
  },
  commands: {
    deleteHandler: {
      reasonCommand: `Command declared as Self-Deleting in Ayako Settings`,
      reasonReply: `Reply declared as Self-Deleting in Ayako Settings`,
    },
    antispamHandler: {
      banErrorMessage: (user: Discord.User) =>
        `I was unable to ban <@${user.id}>. \`Insufficient Permissions\``,
      kickErrorMessage: (user: Discord.User) =>
        `I was unable to kick <@${user.id}>. \`Insufficient Permissions\``,
    },
    afk: {
      category: `Chat`,
      description: `Display a AFK text whenever someone pings you.\nAutomatically deleted if you send a Message 1 Minute after creating your AFK`,
      usage: [`afk (text)`],
      footer: (userId: string, time: Strumber) => `<@${userId}> is AFK since ${time}`,
      updatedTo: (user: Discord.User, text: string) =>
        `**<@${user.id}>'s AFK updated to:**\n${text}`,
      updated: (user: Discord.User) => `**<@${user.id}>'s AFK updated**`,
      noLinks: `**You may not set Links as AFK.**`,
      set: (user: Discord.User) => `**<@${user.id}>'s AFK set**`,
      setTo: (user: Discord.User, text: string) => `**<@${user.id}>'s AFK set to:**\n${text}`,
    },
    antiraidHandler: {
      debugMessage: {
        author: `Join Threshold Breached!`,
        description: `The join Threshold was breached`,
        below: `Every join within the last 20 Seconds:`,
        file: `Every join within the last 20 Seconds can be found in the File attached`,
        printIDs: `Print User IDs`,
        massban: `Massban Users`,
      },
    },
    afkHandler: {
      deletedAfk: "I've deleted your AFK",
      footer: (time: Strumber) => `Welcome back! You have been AFK for ${time}`,
      setAfk: `User went AFK`,
      delAfk: `User returned from being AFK`,
      forceDelAfk: (user: Discord.User, reason: string) =>
        `User's AFK was forcefully deleted by ${user.username}#${user.discriminator} | ${reason}`,
    },
    commandHandler: {
      GuildOnly: `This Command is not made for DMs, please try again in a Server`,
      pleaseWait: (time: Strumber) => `Please wait ${time} before re-using this Command`,
      CategoryDisabled: (category: string) =>
        `Category \`${category}\` was disabled by the Server Administration`,
      CommandDisabled: (name: string) =>
        `Command \`${name}\` was disabled by the Server Administration`,
      creatorOnly: `Only my Creator can use this Command (\`Lars_und_so#0666\`)`,
      ownerOnly: `Only the Owner of this Server can use this Command`,
      missingPermissions: "You don't have enough Permissions to use this Command",
      verifyMessage: `You just issued a **moderation command** by **editing your Message**. \nDo you want to **proceed or abort**.`,
      DMonly: `This Command is not made for Servers, please try again in DMs`,
      modRoleError: `One of your Roles does not allow you to use this Command`,
    },
    toxicityCheck: {
      warning: (user: Discord.User) => `<@${user.id}> Please do not use this word!`,
      warnReason: `Repeatedly sending Blacklisted words`,
      author: `Ayako Blacklist`,
      info: (guild: Discord.Guild) =>
        `The following Words are Blacklisted on **\`${guild.name}\`**:\n`,
    },
    reminder: {
      category: `Info`,
      description: `Set, view and delete Reminders Ayako will remind you of`,
      usage: [`reminder [duration] [text]`, `reminder delete [reminder ID]`, `reminder list`],
      set: `set`,
      delete: `delete`,
      list: `list`,
      created: (id: Strumber, time: Strumber) =>
        `Successfully created Reminder with ID \`${id}\`\nReminder End: ${time}`,
      invalidTime: `The given Time was not valid`,
      noReason: `Please provide a Reason to Remind you of`,
      reminderEnded: (reason: string) => `__Your Reminder has ended:__\n${reason}`,
      placeholder: `Select a Reminder to Edit/Delete`,
      editReason: `Edit`,
      del: `Delete Reminder`,
      desc: `Use the Buttons below to Select a Reminder to Edit or Delete\nTo create a Reminder use the \`reminder [duration] [text]\` Command`,
      author: `Ayako Reminders`,
      ends: `Ends`,
      editTitle: `Edit a Reminder`,
      timeLabel: `Insert new Time Below`,
      editLabel: `Insert new Text Below`,
      editPlaceholder: `Remind me to Vote for Ayako!`,
      timePlaceholder: `11 hours 30 minutes`,
    },
  },
  slashCommands: {
    strike: {
      noneFound: `Your most used Reasons will appear here`,
      areYouSure: (user: Discord.User, punishment: string) =>
        `You are about to strike **${user}**\nDue to their Amount of Warns, this will ${punishment} them\n**Do you want to proceed?**`,
      confirmAuthor: `Confirm Strike`,
      notEnabled: `The Strike System is not enabled\nuse </settings auto-moderation:1014159057919156366> \`setting: Auto-Punish\` to enable it`,
    },
    settings: {
      tutorial: (tutorials: string) => `If you need help, check this Video out: ${tutorials}`,
      active: `Active`,
      mmrPlaceholder: `Select an entry to view`,
      noneFound: `No Settings found`,
      authorType: (type: string) => `Ayako "${type}" Settings Management`,
      author: `Ayako Settings Management`,
      declareCategory: `Declare a Category first`,
      nameDescription: `Colour Code Explanation`,
      selectCategory: `Select a Category`,
      selectSetting: `Select a Setting`,
      editingAuthor: `Editing Ayako Settings`,
      commandDesc: `Use this Command to edit your currently selected Setting`,
      useToEdit: (command: Discord.ApplicationCommand) =>
        `Use </${command.name}:${command.id}> to edit this Setting`,
      selMenu: (type: string) =>
        `Select the ${type} you want to add or remove in the Select Menu below`,
      types: {
        channel: `Channel`,
        user: `User`,
        role: `Role`,
        channels: `Channels`,
        users: `Users`,
        roles: `Roles`,
      },
      colorNames: {
        other: `Other`,
        roles: `Roles`,
        channels: `Channels`,
        chats: `Chats`,
      },
      categories: {
        'auto-moderation': `Auto-Moderation`,
        moderation: `Moderation`,
        automation: `Automation`,
        other: `Other`,
      },
      settingsNames: {
        'anti-spam-punishments': `Anti-Spam Punishments`,
        'anti-spam': `Anti-Spam`,
        'anti-virus': `Anti-Virus`,
        'anti-virus-punishments': `Anti-Virus Punishments`,
        'blacklist-punishments': `Blacklist Punishments`,
        'anti-raid': `Anti-Raid`,
        'auto-punish': `Auto Punish`,
        blacklist: `Blacklist`,
        expiry: `Expiry`,
        'auto-roles': `Auto Roles`,
        cooldowns: `Cooldowns`,
        'disabled-commands': `Disabled Commands`,
        'disboard-reminders': `Disboard Reminders`,
        'self-roles': `Self Roles`,
        separators: `Separators`,
        sticky: `Sticky`,
        suggestions: `Suggestions`,
        verification: `Verification`,
        welcome: `Welcome`,
        leveling: `Leveling`,
        nitro: `Nitro`,
        'reaction-roles': `Reaction Roles`,
        'delete-commands': `Delete Commands`,
        logs: `Logs`,
        language: `Language`,
        overview: `Overview`,
        prefix: `Prefix`,
        seprators: `Role Separators`,
        'leveling-multi-roles': `Leveling Multi-Roles`,
        'leveling-multi-channels': `Leveling Multi-Channels`,
        'level-roles': `Level Roles`,
        'level-rules-channels': `Leveling Rules-Channels`,
      },
      settingsDescriptions: {
        'anti-spam': `Stopping Members from spamming in the Server`,
        'anti-raid': `Stop Raids while they happen! Or at least be notified about one happening`,
        'anti-virus': `Stopping Members and hacked Accounts from sending phishing and in other ways malicious Links in the Server`,
        'auto-punish': `Consistenly punish Members for misbehaving using a custom punishment Setup and a new Command`,
        blacklist:
          "Stopping Members from saying Words or Phrases you'd rather not have them say on your Server",
        expiry: `Let Punishments expire after a certain Amount of Time`,
        'auto-roles': `Automatically assign Roles to newly joining Members or Bots, or Members and Bots`,
        cooldowns: `Define custom Cooldowns on Ayakos Commands`,
        'disabled-commands': `Disable certain Commands of Ayako in some Channels, by Role, or across the whole Server`,
        'disboard-reminders': `Let Ayako remind you to Bump your server on Disboard`,
        'self-roles': `Set Roles as self-assignable, good for Color Roles, Region Roles, Age Roles and similar`,
        separators: `Group the Roles a User has by their Category, good for Servers with many self-assignable and reaction Roles`,
        sticky: `Make Roles and Channel Permissions stick to a Member across re-joins`,
        suggestions: `Give your Members a chance to send share their Thoughts about improving your Server/Project and let them Vote on others Suggestions`,
        verification: `Raise the Effort required to participate in your Server, or certain Channels, with a Text Captcha`,
        welcome: `Send a warm Welcome to newly joining Members`,
        leveling: `Reward Members for their Activity with Roles, and let them compete for the top Spots on a Leaderboard`,
        nitro: `Monitor your Servers Boosters, and reward them with continuously boosting`,
        'reaction-roles': `Let Members pick their own Roles by Reactions or Buttons`,
        'delete-commands': `Delete Commands issued by Users after a certain Amount of Time, or/and Ayakos Response to them`,
        logs: `Log Events of every kind into designated Log Channels`,
        language: `Change the display Language of Ayako`,
        overview: `Get a quick Overview over the most important Settings of Ayako`,
        prefix: `Assign a custom Prefix to Ayako`,
      },
      settings: {
        leveling: {
          stack: `Stack`,
          replace: `Replace`,
          react: `React`,
          silent: `Silent`,
          embed: {
            name: `Embed`,
            desc: `Embed to use for Level-Up Messages`,
          },
          xpmultiplier: {
            name: `XP Multiplier`,
            desc: `Multiplier applied to \`XP per Message\``,
          },
          xppermsg: {
            name: `XP per Message`,
            desc: `XP added to a User per counted Message`,
          },
          rolemode: {
            name: `Role Mode`,
          },
          lvlupmode: {
            name: `Level-Up Mode`,
            desc: `Embed | Reactions | Silent`,
          },
          lvlupdeltimeout: {
            name: `Delete Timeout`,
            desc: `Time after which the Level-Up Message or Level-Up Reactions are deleted`,
          },
          lvlupchannels: {
            name: `Level-Up Channels`,
            desc: `Channels in which Level-Up Messages are posted. If none are set the Level-Up Message will be posted as reply to the Message which caused the Level-Up`,
          },
          ignoreprefixes: {
            name: `Ignore Prefixes`,
          },
          prefixes: {
            name: `Prefixes`,
            desc: `If any of the provided Prefixes is used, the Message is not awarded any XP`,
          },
          blchannels: {
            name: `Blacklisted Channels`,
            desc: `Channels ignored by Ayako Leveling`,
          },
          blusers: {
            name: `Blacklisted Users`,
            desc: `Users ignored by Ayako Leveling`,
          },
          blroles: {
            name: `Blacklisted Roles`,
            desc: `Roles ignored by Ayako Leveling`,
          },
          wlchannels: {
            name: `Whitelisted Channels`,
            desc: `Channels ignored by Ayako Anti-Spam`,
          },
          wlusers: {
            name: `Whitelisted Users`,
            desc: `Users ignored by Ayako Anti-Spam`,
          },
          wlroles: {
            name: `Whitelisted Roles`,
            desc: `Roles ignored by Ayako Anti-Spam`,
          },
          lvlupemotes: {
            name: `Reactions`,
            desc: `The Reactions added to a Message on Level-Up`,
          },
        },
        'level-roles': {
          level: {
            name: `Level`,
            desc: `Level required to gain this Role`,
          },
          roles: {
            name: `Roles`,
            desc: `Roles given to the Member who reached this Level`,
          },
        },
        welcome: {
          channelid: {
            name: `Channel`,
            desc: `Channel in which the Welcome Message will be sent`,
          },
          embed: {
            name: `Embed`,
            desc: `Embed which will be used to greet arriving Members`,
          },
          pingroles: {
            name: `Ping Roles`,
            desc: `Roles to Ping once a new Member joins`,
          },
          pingusers: {
            name: `Ping Users`,
            desc: `Users to Ping once a new Member joins`,
          },
          pingjoin: {
            name: `Ping joined Member`,
          },
        },
        verification: {
          logchannel: {
            name: `Log-Channel`,
            desc: `Verification Log-Channel`,
          },
          finishedrole: {
            name: `Finished Role`,
            desc: `Role given to a Member once they finished Verification`,
          },
          pendingrole: {
            name: `Pending Role`,
            desc: `Role given to a Member upon joining the Server to mark them as "pending"`,
          },
          startchannel: {
            name: `Start Channel`,
            desc: `Channel arriving Members will be able to re-/start the Verification in`,
          },
          selfstart: {
            name: `Self-Start`,
          },
          kickafter: {
            name: `Kick Timeout`,
            desc: `Time after which un-verified Members will be kicked from the Server`,
          },
          kicktof: {
            name: `Kick Unverified Members`,
          },
        },
        suggestions: {
          channelid: {
            name: `Channel`,
            desc: `The Channel Suggestions will be posted in`,
          },
          novoteroles: {
            name: `No-Vote Roles`,
            desc: `Members with any of these Roles cannot vote`,
          },
          novoteusers: {
            name: `No-Vote Users`,
            desc: `Users listed here cannot vote`,
          },
          approverroleid: {
            name: `Approver Roles`,
            desc: `Members with any of these Roles can approve and deny Suggestions`,
          },
          anonvote: {
            name: `Anonymous Votes`,
          },
          anonsuggestion: {
            name: `Anonymous Suggestions`,
          },
          nosendroles: {
            name: `No-Suggestion Roles`,
            desc: `Members with any of these Roles cannot send Suggestions`,
          },
          nosendusers: {
            name: `No-Suggestion Users`,
            desc: `Users listed here cannot send Suggestions`,
          },
        },
        'self-roles': {
          name: {
            name: `Name`,
            desc: `Name of this Category`,
          },
          roles: {
            name: `Roles`,
            desc: `The self-assignable Roles`,
          },
          onlyone: {
            name: `Only One`,
            desc: `Whether only one of the Roles can be picked`,
          },
          blacklistedroles: {
            name: `Blacklisted Roles`,
            desc: `Members with any of these Roles cannot self-assign the Roles of this Category`,
          },
          blacklistedusers: {
            name: `Blacklisted Users`,
            desc: `Users which cannot self-assign the Roles of this Category`,
          },
          whitelistedroles: {
            name: `Whitelisted Roles`,
            desc: `Members with any of these Roles can self-assign the Roles of this Category, even if they have a Blacklisted Role`,
          },
          whitelistedusers: {
            name: `Whitelisted Users`,
            desc: `Users which can self-assign the Roles of this Category, even if they have a Blacklisted Role`,
          },
        },
        expiry: {
          desc: `⚠️Note:⚠️\nAll of these Settings are Ayako-Internal!\nExample: Setting Bans to expire after 5 Months will not lead to an Auto-Unban after 5 Months, the entry will just be deleted from Commands like </check:1019550801355624478>`,
          bans: {
            name: `Bans Expire`,
          },
          channelbans: {
            name: `Channel-Bans Expire`,
          },
          kicks: {
            name: `Kicks Expire`,
          },
          mutes: {
            name: `Mutes Expire`,
          },
          warns: {
            name: `Warns Expire`,
          },
          banstime: {
            name: `Ban Expire Time`,
            desc: `Time after which Bans expire`,
          },
          channelbanstime: {
            name: `Channel-Ban Expire Time`,
            desc: `Time after which Channel-Ban expire`,
          },
          kickstime: {
            name: `Kick Expire Time`,
            desc: `Time after which Kicks expire`,
          },
          mutestime: {
            name: `Mute Expire Time`,
            desc: `Time after which Mutes expire`,
          },
          warnstime: {
            name: `Warn Expire Time`,
            desc: `Time after which Warns expire`,
          },
        },
        logs: {
          ayako: `Ayako Logs`,
          guild: `Discord Logs`,
          emojievents: {
            name: `Emoji Events`,
            desc: `Log-Channels for changes to this Servers Emojis`,
          },
          guildevents: {
            name: `Server Events`,
            desc: `Log-Channels for changes to this Server`,
          },
          inviteevents: {
            name: `Invite Events`,
            desc: `Log-Channels for changes to this Servers Invites`,
          },
          messageevents: {
            name: `Message Events`,
            desc: `Log-Channels for changes to Messages`,
          },
          modlogs: {
            name: `Mod Log`,
            desc: `Log-Channels for Mod Commands`,
          },
          roleevents: {
            name: `Role Events`,
            desc: `Log-Channels for changes to this Servers Roles`,
          },
          userevents: {
            name: `User Events`,
            desc: `Log-Channels for changes to Users`,
          },
          voiceevents: {
            name: `Voice Events`,
            desc: `Log-Channels for changes to Voice States`,
          },
          webhookevents: {
            name: `Emoji Events`,
            desc: `Log-Channels for changes to this Servers Webhooks`,
          },
          settingslog: {
            name: `Setting Log`,
            desc: `Log-Channels for changes to this Ayakos Settings`,
          },
          channelevents: {
            name: `Channel Events`,
            desc: `Log-Channels for changes to this Servers Channels`,
          },
          stickerevents: {
            name: `Sticker Events`,
            desc: `Log-Channels for changes to this Servers Stickers`,
          },
          threadevents: {
            name: `Thread Events`,
            desc: `Log-Channels for changes to Threads`,
          },
          guildmemberevents: {
            name: `Member Events`,
            desc: `Log-Channels for changes to Members`,
          },
          stageevents: {
            name: `Stage Events`,
            desc: `Log-Channels for changes to Stages`,
          },
        },
        prefix: {},
        language: {},
        overview: {
          requiresAdmin: `This Setting requires Administrator Permissions`,
          prefix: {
            name: `Prefix`,
            desc: `Ayako Custom Prefix`,
          },
          interactionsmode: {
            name: `Interactions Size`,
          },
          lan: {
            name: `Language`,
            desc: `Ayakos display Language`,
          },
          errorchannel: {
            name: `Error Channel`,
            desc: `Channel where Error Messages will be posted in`,
          },
          vanity: {
            name: `Auto-Vanity`,
            desc: `Automatically applied Vanity URL when the Server meets requirements\n(requires Administrator Permission, does not apply when the Vanity URL is taken)`,
          },
        },
        'disboard-reminders': {
          repeatenabled: {
            name: `Repeat`,
          },
          repeatreminder: {
            name: `Repeat Timeout`,
            desc: `Time after which the Discord Reminder will be reposted if no one used </bump:947088344167366698> yet`,
          },
          channelid: {
            name: `Reminder Channel`,
            desc: `Channel the Reminder will be posted in\nIf no Channel is specified, the Reminder will be posted in the Channel </bump:947088344167366698> was last used in`,
          },
          roles: {
            name: `Ping Roles`,
            desc: `Roles pinged with the Bump Reminder`,
          },
          users: {
            name: `Ping Users`,
            desc: `Users pinged with the Bump Reminder`,
          },
          deletereply: {
            name: `Delete DISBOARD Reply`,
          },
        },
        'delete-commands': {
          deletecommand: {
            name: `Delete Command`,
          },
          deletereply: {
            name: `Delete Reply`,
          },
          deletetimeout: {
            name: `Timeout`,
            desc: `Time to wait before deleting the Reply and/or the Command`,
          },
          command: {
            name: `Command`,
            desc: `The Command on this Setting applies to`,
          },
          wlchannelid: {
            name: `Whitelisted Channels`,
            desc: `Channels this Deletion does not apply to`,
          },
          activechannelid: {
            name: `Active Channels`,
            desc: `Channels this Deletion applies to\nIf no Channels are specified the Deletion applies to all Channels`,
          },
        },
        cooldowns: {
          slashCommandDescription: `Type of Command`,
          command: {
            name: `Command`,
            desc: `Command this Cooldown applies to`,
          },
          cooldown: {
            name: `Cooldown`,
            desc: `Cooldown applied to the Command`,
          },
          bpchannelid: {
            name: `Whitelisted Channels`,
            desc: `Channels ignored by Ayako Blacklist`,
          },
          bpuserid: {
            name: `Whitelisted Users`,
            desc: `Users ignored by Ayako Blacklist`,
          },
          bproleid: {
            name: `Whitelisted Roles`,
            desc: `Roles ignored by Ayako Blacklist`,
          },
          activechannelid: {
            name: `Active Channels`,
            desc: `Channels this Cooldown applies to\nIf no Channels are specified the Cooldown applies to all Channels`,
          },
        },
        blacklist: {
          authorName: `Blacklisted Word said`,
          description: (words?: string) =>
            `Please refrain from using ${
              words
                ? `any of the following Words\nThis __includes__ not blacklisted Variations of following Words\n*Server Staff may punish more strictly for bypassing the Blacklist*\n${words}`
                : 'blacklisted Words'
            }`,
          field: `You used following Words`,
          bpchannelid: {
            name: `Whitelisted Channels`,
            desc: `Channels ignored by Ayako Blacklist`,
          },
          bpuserid: {
            name: `Whitelisted Users`,
            desc: `Users ignored by Ayako Blacklist`,
          },
          bproleid: {
            name: `Whitelisted Roles`,
            desc: `Roles ignored by Ayako Blacklist`,
          },
          words: {
            name: `Words/Phrases`,
            desc: `Blacklisted Words and Phrases`,
          },
        },
        'auto-punish': {
          description: `**How to use**\nTo use the Auto-Punishment System\n__use__ </strike:1014158232299778048>\ninstead of regular Moderation Commands\n\nThe Auto-Punish System does not take your ability to use regular Moderation Commands, it just guarantees consisten Punishments\n\n\u200b`,
          duration: {
            name: `Punishment Duration`,
            desc: `Only applies to Punishments prefixed with \`Temp\``,
          },
          warnamount: {
            name: `Warn Amount`,
            desc: `Number of Warns at which this Punishment is applied`,
          },
          punishment: {
            name: `Punishment`,
            desc: `Punishment to apply`,
          },
          addroles: {
            name: `Add Roles`,
            desc: `Roles to add when the Punishment is applied`,
          },
          removeroles: {
            name: `Remove Roles`,
            desc: `Roles to remove when the Punishment is applied`,
          },
          confirmationreq: {
            name: `Confirmation Required`,
          },
          punishmentawaittime: {
            name: `Confirmation Timeout`,
            desc: `How long to wait for the Punishment approval\nIf no Response is received the Punishment will be applied`,
          },
        },
        'auto-roles': {
          botroleid: {
            name: `Bot Roles`,
            desc: `Roles added to joining Bots`,
          },
          userroleid: {
            name: `User Roles`,
            desc: `Roles added to joining Users`,
          },
          allroleid: {
            name: `All Roles`,
            desc: `Roles added to joining Users and Bots`,
          },
        },
        'anti-virus-punishments': {
          duration: {
            name: `Punishment Duration`,
            desc: `Only applies to Punishments prefixed with \`Temp\``,
          },
          warnamount: {
            name: `Warn Amount`,
            desc: `Number of Warns at which this Punishment is applied`,
          },
          punishment: {
            name: `Punishment`,
            desc: `Punishment to apply`,
          },
        },
        'anti-virus': {
          minimize: {
            name: `Minimize Timeout`,
            desc: `Timeout to minimize punishment Embed`,
          },
          delete: {
            name: `Delete Timeout`,
            desc: `Timeout to delete punishment Embed`,
          },
          minimizetof: {
            name: `Minimize`,
          },
          deletetof: {
            name: `Delete`,
          },
          linklogging: {
            name: `Link Logging`,
          },
          linklogchannels: {
            name: `Link Log-Channels`,
            desc: `Channels in which to Log all detected Links in`,
          },
        },
        'anti-raid': {
          punishment: {
            name: `Punishment`,
            desc: `Punishment to apply to Raiders`,
          },
          posttof: {
            name: `Raid Notice`,
          },
          postchannel: {
            name: `Raid Notice Channel`,
            desc: `Channel to post the Raid Notice in`,
          },
          pingroles: {
            name: `Raid Notice Ping Roles`,
            desc: `Roles to Ping when a Raid Notice is posted`,
          },
          pingusers: {
            name: `Raid Notice Ping Users`,
            desc: `Users to Ping when a Raid Notice is posted`,
          },
          time: {
            name: `Timeout`,
            desc: `Used in combination with \`Join Threshold\`\nUsers will be punished after exceeding the set \`Join Threshold\` within the set \`Timeout\``,
          },
          jointhreshold: {
            name: `Join Threshold`,
            desc: `Used in combination with \`Timeout\`\nUsers will be punished after exceeding the set \`Join Threshold\` within the set \`Timeout\``,
          },
          punishmenttof: {
            name: `Punish Raiders`,
          },
        },
        'anti-spam': {
          deletespam: {
            name: `Delete Spam`,
          },
          wlchannelid: {
            name: `Whitelisted Channels`,
            desc: `Channels ignored by Ayako Anti-Spam`,
          },
          wluserid: {
            name: `Whitelisted Users`,
            desc: `Users ignored by Ayako Anti-Spam`,
          },
          wlroleid: {
            name: `Whitelisted Roles`,
            desc: `Roles ignored by Ayako Anti-Spam`,
          },
          msgthreshold: {
            name: `Message Threshold`,
            desc: `Used in combination with \`Timeout\`\nUser will be punished after exceeding the set \`Message Threshold\` within the set \`Timeout\``,
          },
          dupemsgthreshold: {
            name: `Duplicate Message Threshold`,
            desc: `Used in combination with \`Timeout\`\nUser will be punished after exceeding the set \`Duplicate Message Threshold\` within the set \`Timeout\``,
          },
          timeout: {
            name: `Timeout`,
            desc: `Used in combination with \`Message Threshold\` and \`Duplicate Message Threshold\`\nUser will be punished after exceeding the set \`Message Threshold\` or \`Duplicate Message Threshold\` within the set \`Timeout\``,
          },
        },
        'anti-spam-punishments': {
          duration: {
            name: `Punishment Duration`,
            desc: `Only applies to Punishments prefixed with \`Temp\``,
          },
          warnamount: {
            name: `Warn Amount`,
            desc: `Number of Warns at which this Punishment is applied`,
          },
          punishment: {
            name: `Punishment`,
            desc: `Punishment to apply`,
          },
        },
        'blacklist-punishments': {
          duration: {
            name: `Punishment Duration`,
            desc: `Only applies to Punishments prefixed with \`Temp\``,
          },
          warnamount: {
            name: `Warn Amount`,
            desc: `Number of Warns at which this Punishment is applied`,
          },
          punishment: {
            name: `Punishment`,
            desc: `Punishment to apply`,
          },
        },
        separators: {
          type: `Separator`,
          oneTimeRunner: {
            name: `Apply ALL Separators to EVERY Member of your Server`,
            description: `Can only be run if the previous Process is finished.`,
            cant: "You don't have any Separators set, so you can't uset his function",
            timeout: `The Operation timed out, please contact Support\nhttps://support.ayakobot.com`,
            recommended: `Are you sure you want to run this Function?\nThis can only be run if the previous Process is finished`,
            stats: (roles: Strumber, members: Strumber, finishTime: Strumber) =>
              `Adding and Removing \`${roles}\` Roles from \`${members}\` Server Members\nThis Process may take until ${finishTime}.\n\nThis Embed will be updated every Hour (+ Calculation delay depending on the size of your Server)`,
            answers: `\`Yes\` or \`No\``,
            stillrunning: `The last initiated Process is still running`,
            finished: `Process finished, all Roles should be up to Date`,
          },
          separator: {
            name: `Separator`,
            desc: `The Separator itself, or Category Role, whatever you wanna call it`,
          },
          stoprole: {
            name: `Stop Role`,
            desc: `The Role above which the dynamically assigned Roles end`,
          },
          isvarying: {
            name: `Dynamic`,
          },
          roles: {
            name: `Roles`,
            desc: `Static Roles, assigned to this Separator`,
          },
          name: {
            name: `Name`,
            desc: `The Name of this Separator`,
          },
        },
        sticky: {
          roleReason: `Ayako Sticky Roles`,
          permReason: `Ayako Sticky Perms`,
          unstickyroles: {
            name: `Un-Sticky Roles`,
            desc: `Roles which are excluded from being sticky`,
          },
          stickyroles: {
            name: `Sticky Roles`,
            desc: `Roles which are sticky`,
          },
          stickyrolesmode: {
            name: `Sticky Roles Mode`,
          },
          stickyrolesactive: {
            name: `Sticky Roles Active`,
          },
          stickypermsactive: {
            name: `Sticky Perms Active`,
          },
        },
      },
    },
    giveaway: {
      description: `Create a Giveaway`,
      usage: [`giveaway`],
      category: `Giveaway`,
      noneFound: `No Giveaways found`,
      create: {
        description: `Create a Giveaway`,
        missingPermissions: "I can't send or view Messages in this Channel",
        invalidTime: `The provided Time was invalid`,
        author: `Ayako Giveaways`,
        participants: `Participants`,
        winners: `Possible Winners: `,
        end: `End:`,
        host: `Giveaway Host`,
        roleRequire: `Required Role to enter this Giveaway`,
        participate: `Participate`,
        sent: (channel: Discord.Channel) => `Giveaway started in <#${channel.id}>`,
        error: `Failed to create Giveaway`,
      },
      end: {
        description: `End a Giveaway manually`,
        ended: `Ended`,
        winner: `Winner`,
        winners: `Winners`,
        author: `Ayako Giveaways`,
        title: `Congratulations! You won a Giveaway! [Click me to get to the Giveaway]`,
        trouble: `If you have trouble with your Giveaway, DM or @Mention the User below`,
        getPrize: `To get your Prize, DM or @Mention the User below`,
        couldntDM: (user: Discord.User) =>
          `I was unable to DM <@${user.id}> / \`${user.username}#${user.discriminator}\` / \`${user.id}\``,
        noValidEntries: `No valid Entries | No Winner picked`,
        checkDMs: `Check your DMs! | If you had your DMs closed, DM or @Mention the User below`,
        button: `Get to Giveaway`,
        manuallyEnded: `Manually Ended Giveaway`,
        clickButton: `Click the Button below to claim your Prize`,
        limitedTime: (inTime: string, time: string) => `Your prize expires ${inTime} (${time})`,
        timeRanOut: `You can no longer claim your Prize since you took too long to claim it\nI will now re-roll the Giveaway`,
      },
      participate: {
        cantEnter: "You don't meet the Requirements to participate in this Giveaway",
        entered: `You are now participating in this Giveaway`,
        left: `You are no longer participating in this Giveaway`,
        participants: `Participants`,
      },
      edit: {
        description: `Edit a Giveaway`,
        invalidTime: `The given Time was not valid`,
        noChanges: `No valid changes were made`,
        success: `Successfully edited Giveaway`,
        button: `Get to Giveaway`,
        noOptionsProvided: `Please provide Options to change`,
      },
      reroll: {
        description: `Re-roll a Giveaway`,
        rerolled: `Successfully re-rolled Giveaway`,
        button: `Get to Giveaway`,
      },
    },
  },
  nitro: {
    given: (user: Discord.User, roles: string, days: Strumber) =>
      `<@${user.id}> has been given\n${roles}\nfor boosting ${days} Days`,
    taken: (user: Discord.User, roles: string) => `<@${user.id}> has been taken\n${roles}\nfrom`,
  },
  autotypes: {
    antispam: `Ayako Anti-Spam`,
    antiraid: `Ayako Anti-Raid`,
    antivirus: `Ayako Anti-Virus`,
    blacklist: `Ayako Blacklist`,
    statschannel: `Ayako Stats-Channel`,
    separators: `Ayako Separators`,
    autopunish: `Ayako Auto-Punish`,
    selfroles: `Ayako Self-Roles`,
    nitro: `Ayako Nitro-Monitoring`,
    autoroles: `Ayako Auto-Roles`,
  },
  mod: {
    warning: {
      text: `You just issued a **Moderation Command** on a User with a **Mod Role**. \nDo you want to **proceed** or **abort**.`,
      proceed: `Proceed`,
      abort: `Abort`,
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
      loading: `Temp-Muting User...`,
      error: "I wasn't able to Temp-Mute this User!",
      noMember: `This User is not a Member of this Server`,
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
      loading: `Un-Muting User...`,
      error: "I wasn't able to Un-Mute this User!",
      noMember: `This User is not a Member of this Server`,
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
      alreadyApplied: (args: CT.ModBaseEventOptions) =>
        `User <@${args.target.id}> is already Banned`,
      success: (args: CT.ModBaseEventOptions) => `User <@${args.target.id}> was Banned`,
      loading: `Banning User...`,
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
          `You have been added to \`${args.role?.name}\` on \`${
            args.guild?.name ?? 'unknwon Guild'
          }\``,
      },
      exeNoPerms: "You can't add this User to Roles",
      permissionError: "I don't have enough Permissions to add Roles to this User",
      error: "I wasn't able to add this User to Roles!",
      alreadyApplied: (args: CT.ModBaseEventOptions) =>
        `User <@${args.target.id}> already has Role ${args.role} added`,
      success: (args: CT.ModBaseEventOptions) => `<@${args.target.id}> added to Role ${args.role}`,
      loading: `Adding User to Role...`,
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
      success: (args: CT.ModBaseEventOptions) =>
        `<@${args.target.id}> removed from Role ${args.role}`,
      loading: `Removing User from Role...`,
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
      alreadyApplied: (args: CT.ModBaseEventOptions) =>
        `User <@${args.target.id}> is already banned`,
      success: (args: CT.ModBaseEventOptions) => `User <@${args.target.id}> was Soft-Banned`,
      loading: `Soft-Banning User...`,
      selfPunish: "You can't Soft-Ban yourself",
      mePunish: "I won't Soft-Ban myself",
      unbanReason: `Soft-Ban`,
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
      loading: `Temp-Banning User...`,
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
      loading: `Channel-Banning User...`,
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
      success: (args: CT.ModBaseEventOptions) =>
        `User <@${args.target.id}> was Temp-Channel-Banned`,
      loading: `Temp-Channel-Banning User...`,
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
      loading: `Channel-Unbanning User...`,
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
      loading: `Un-Banning User...`,
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
      loading: `Kicking User...`,
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
      antispam: `**Please stop Spamming**`,
      antivirus: `**Please do not post Malicious Links**`,
      blacklist: `**Please do not send Blacklisted Words**\nCheck your DMs for a List of them`,
      success: (args: CT.ModBaseEventOptions) => `User <@${args.target.id}> was Warned`,
      loading: `Warning User...`,
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
      loading: `Soft-Warning User...`,
      selfPunish: "You can't Soft-Warn yourself",
      mePunish: "I won't Soft-Warn myself",
    },
  },
  leveling: {
    author: (msg: CT.GuildMessage) =>
      `Welcome ${msg.author.username}#${msg.author.discriminator} to ${msg.guild.name}`,
    description: (reactions?: string) =>
      `${
        reactions ? 'On' : 'Normally, on'
      } this Server, Level-Ups are indicated by Reactions on your Message\n${
        reactions
          ? `The current Reactions are: ${reactions}`
          : "However, I currently don't have access to the Emotes or there are none set"
      }`,
    reason: `Ayako Leveling`,
  },
  antivirus: {
    whitelisted: (tick: string) => `${tick} This Link is __not__ Malicious`,
    checking: `Link:`,
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
      href: `Hyperlink Reference`,
      url: `URL`,
      hostname: `URL Hostname`,
      baseURL: `Base URL`,
      baseURLhostname: `Base URL Hostname`,
      author: `Ayako Link Log`,
    },
  },
  errors: {
    userNotExist: `The @Mentioned User does not exist`,
    userNotFound: `The @Mentioned User could not be found`,
    numTooLarge: `Number too large`,
    guildCommand: `This Command is only available in Servers`,
    memberNotFound: `Member not found`,
    notAvailableAPI: `This Command is not yet available due to Discord API limitations`,
    sendMessage: `I cannot send Messages in this Channel`,
    lackingAccess: (emotes: string) => `I'm lacking access to these emotes: ${emotes}`,
    channelNotManageable: "I'm lacking Permissions to edit that Channel",
    roleNotFound: `Role not Found`,
    notYours: "You can't interact with someone elses Messages",
    time: `Time ran out`,
    noGuildFound: 'No Server found, please report to the Support Server',
    noChannelFound: 'No Channel found, please report to the Support Server',
    noRoleFound: 'No Role found, please report to the Support Server',
  },
  channelRules: {
    HasLeastAttachments: `Has at least [externally defined] Attachments`,
    HasLeastAttachmentsShort: `least Attachments count`,
    HasMostAttachments: `Has at most [externally defined] Attachments`,
    HasMostAttachmentsShort: `most Attachments count`,
    HasLeastCharacters: `Has at least [externally defined] Characters in Content`,
    HasLeastCharactersShort: `least Characters count`,
    HasMostCharacters: `Has at most [externally defined] Characters in Content`,
    HasMostCharactersShort: `most Characters count`,
    HasLeastWords: `Has at least [externally defined] Words in Content`,
    HasLeastWordsShort: `least Words count`,
    HasMostWords: `Has at most [externally defined] Words in Content`,
    HasMostWordsShort: `most Words count`,
    MentionsLeastUsers: `Mentions at least [externally defined] Users in Content`,
    MentionsLeastUsersShort: `least Users count`,
    MentionsMostUsers: `Mentions at most [externally defined] Users in Content`,
    MentionsMostUsersShort: `most Users count`,
    MentionsLeastChannels: `Mentions at least [externally defined] Channels in Content`,
    MentionsLeastChannelsShort: `least Channels count`,
    MentionsMostChannels: `Mentions at most [externally defined] Channels in Content`,
    MentionsMostChannelsShort: `most Channels count`,
    MentionsLeastRoles: `Mentions at least [externally defined] Roles in Content`,
    MentionsLeastRolesShort: `least Roles count`,
    MentionsMostRoles: `Mentions at most [externally defined] Roles in Content`,
    MentionsMostRolesShort: `most Roles count`,
    HasLeastLinks: `Has at least [externally defined] Links`,
    HasLeastLinksShort: `least Links count`,
    HasMostLinks: `Has at most [externally defined] Links`,
    HasMostLinksShort: `most Links count`,
    HasLeastEmotes: `Has at least [externally defined] Emotes`,
    HasLeastEmotesShort: `least Emotes count`,
    HasMostEmotes: `Has at most [externally defined] Emotes`,
    HasMostEmotesShort: `most Emotes count`,
    HasLeastMentions: `Has at least [externally defined] @Mentions`,
    HasLeastMentionsShort: `least @Mentions count`,
    HasMostMentions: `Has at most [externally defined] @Mentions`,
    HasMostMentionsShort: `most @Mentions count`,
  },
  antiraid: {
    banAdd: {
      author: (amount: Strumber) => `${amount} Users were Banned by Ayako Anti-Raid`,
    },
    kickAdd: {
      author: (amount: Strumber) => `${amount} Users were Kicked by Ayako Anti-Raid`,
    },
  },
  userFlags: {
    Staff: 'Discord Employee',
    DiscordEmployee: `Discord Employee`,
    PartneredServerOwner: `Partnered Server Owner`,
    Partner: `Partnered Server Owner`,
    Hypesquad: 'Hype Squad Events Member',
    HypesquadEvents: `Hype Squad Events Member`,
    HypeSquadEventsMember: `Hype Squad Events Member`,
    BughunterLevel1: `Bug Hunter Level 1`,
    HypeSquadOnlineHouse1: 'House of Bravery Member',
    HouseBravery: `House of Bravery Member`,
    HypeSquadOnlineHouse2: 'House of Brilliance Member',
    HouseBrilliance: `House of Brilliance Member`,
    HypeSquadOnlineHouse3: 'House of Balance Member',
    HouseBalance: `House of Balance Member`,
    PremiumEarlySupporter: 'Early Supporter',
    EarlySupporter: `Early Supporter`,
    TeamPseudoUser:
      'User is a [Team](https://discord.com/developers/docs/topics/teams "Click to find out what a Team is")',
    TeamUser: `User is a [Team](https://discord.com/developers/docs/topics/teams "Click to find out what a Team is")`,
    BughunterLevel2: `Bug Hunter Level 2`,
    VerifiedBot: `Verified Bot`,
    VerifiedDeveloper: 'Early Verified Bot Developer',
    CertifiedModerator: 'Certified Moderator',
    BotHTTPInteractions: `HTTP Interactions Bot`,
    ActiveDeveloper: 'Active Developer',
    Bot: `Unverified Bot`,
    Nitro: `Nitro`,
    Boost1: `Boosting since less than 2 Months`,
    Boost2: `Boosting since at least 2 Months`,
    Boost3: `Boosting since at least 3 Months`,
    Boost6: `Boosting since at least 6 Months`,
    Boost9: `Boosting since at least 9 Months`,
    Boost12: `Boosting since at least 12 Months`,
    Boost15: `Boosting since at least 15 Months`,
    Boost18: `Boosting since at least 18 Months`,
    Boost24: `Boosting since at least 24 Months`,
    Spammer: 'Spammer',
    Quarantined: 'Quarantined',
  },
  features: {
    ANIMATED_ICON: `\`Animated Icon\` \`(Server can set an animated Server Icon)\``,
    ANIMATED_BANNER: `\`Animated Banner\` \`(Server can set an animated Server Banner)\``,
    AUTO_MODERATION: `\`Auto Moderation\` \`(Server can acccess Auto Moderation Settings)\``,
    BANNER: `\`Banner\` \`(Server can set a Server Banner Image)\``,
    COMMERCE: `\`Commerce\` \`(Server can use commerce Features (i.e. Create Store Channels))\``,
    COMMUNITY: `\`Community\` \`(Server can enable Welcome Screen)\``,
    CREATOR_MONETIZABLE: `\`Creator Monetizable\` \`(??)\``,
    CREATOR_MONETIZABLE_DISABLED: `\`Creator Monetizable disabled\` \`(Server currently does not meet the Requirements for Creator Monetization)\``,
    DISCOVERABLE: `\`Discoverable\` \`(Server can be discovered in the Server directory)\``,
    DISCOVERABLE_DISABLED: `\`Discorverable disabled\` \`(Server currently does not meet the Requirements for Discovery)\``,
    ENABLED_DISCOVERABLE_BEFORE: `\`Discorverable enabled before\` \`(Server had Discovery enabled before)\``,
    GUILD_HOME_TEST: `\`Guild Home Test\` \`(??)\``,
    HAS_DIRECTORY_ENTRY: `\`Has Directory Entry\` \`(??)\``,
    HUB: `\`Hub\` \`(??)\``,
    LINKED_TO_HUB: `\`Linked to Hub\` \`(??)\``,
    PREVIOUSLY_DISCOVERABLE: `\`Previously Discoverable\` \`(Server was previously Discoverable)\``,
    ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE: `\`Role Subscriptions available for purchase\` \`(Members can buy Roles)\``,
    ROLE_SUBSCRIPTIONS_ENABLED: `\`Role Subscriptions enabled\` \`(Members can buy Roles)\``,
    SEVEN_DAY_THREAD_ARCHIVE: `\`Seven Day Thread Archive\` \`(Server has access to Seven Day Thread Archive Option)\``,
    THREE_DAY_THREAD_ARCHIVE: `\`Three Day Thread Archive\` \`(Server has access to Three Day Thread Archive Option)\``,
    TEXT_IN_VOICE_ENABLED: `\`Text in Voice enabled\` \`(Server has enabled Text in Voice Channels)\``,
    THREADS_ENABLED: `\`Threads Enabled\` \`(Server has enabled Threads)\``,
    THREADS_ENABLED_TESTING: `\`Threads Enabled\` \`(Server has enabled Threads for Testing)\``,
    MORE_EMOJI: `\`More Emojis\` \`(Server has increased Custom Emoji Slots)\``,
    MORE_EMOJIS: `\`More Emojis\` \`(Server has increased Custom Emoji Slots)\``,
    NEW_THREAD_PERMISSIONS: `\`News Thread Permissions\` \`(??)\``,
    FEATURABLE: `\`Featurable\` \`(Server can be featured in the Server directory)\``,
    INVITE_SPLASH: `\`Invite Splash\` \`(Server can set an Invite Splash Background)\``,
    MEMBER_VERIFICATION_GATE_ENABLED: `\`Member Verification Gate enabled\` \`(Server has enabled Membership Screening)\``,
    MONETIZATION_ENABLED: `\`Monetization Enabled\` \`(Server has enabled Monetization)\``,
    MORE_STICKERS: `\`More Stickers\` \`(Server has increased Custom Sticker Slots)\``,
    NEWS: `\`News\` \`(Server can create News Channels)\``,
    PARTNERED: `\`Partnered\` \`(Server is officially Partnered with Discord)\``,
    PREVIEW_ENABLED: `\`Preview enabled\` \`(Server can be Previewed before joining)\``,
    PRIVATE_THREADS: `\`Private Threads\` \`(Server has access to Private Threads)\``,
    ROLE_ICONS: `\`Role Icons\` \`(Server can set Role Icons)\``,
    TICKETED_EVENTS_ENABLED: `\`Ticketed Events enabled\` \`(Server can charge for Events)\``,
    VANITY_URL: `\`Vanity URL\` \`(Server has a Vanity URL)\``,
    VERIFIED: `\`Verified\` \`(Server is officially Verified by Discord)\``,
    VIP_REGIONS: `\`VIP Voice Channel Regions\` \`(Server has access to VIP Voice Channels (384kbps))\``,
    WELCOME_SCREEN_ENABLED: `\`Welcome Screen enabled\` \`(Server has welcome Screen enabled)\``,
  },
  permissions: {
    categories: {
      GENERAL: `General Server Permissions`,
      MEMBER: `Membership Permissions`,
      TEXT: `Text Channel Permissions`,
      VOICE: `Voice Channel Permissions`,
      STAGE: `Stage Channel Permissions`,
      EVENTS: `Events Permissions`,
      ADVANCED: `Advanced Permissions`,
    },
    error: {
      msg: "I'm missing Permissions to execute this Command",
      needed: `Needed Permissions:`,
      role: "I can't manage this Role",
      you: `You are missing Permissions to execute this Command`,
    },
    perms: {
      CreateInstantInvite: `Create Instant Invite`,
      KickMembers: `Kick Members`,
      BanMembers: `Ban Members`,
      Administrator: `Administrator`,
      ManageChannel: `Manage Channel`,
      ManageChannels: `Manage Channels`,
      ManageGuild: `Manage Guild/Server`,
      AddReactions: `Add Reactions`,
      ViewAuditLog: `View Audit Log`,
      PrioritySpeaker: `Priority Speaker`,
      Stream: `Stream`,
      ReadMessages: `Read Messages`,
      ViewChannel: `View Channel`,
      ViewChannels: `View Channels`,
      SendMessages: `Send Messages`,
      SendTTSMessages: `Send TTS Messages`,
      ManageMessages: `Manage Messages`,
      EmbedLinks: `Embed Links`,
      AttachFiles: `Attach Files`,
      ReadMessageHistory: `Read Message History`,
      MentionEveryone: `Mention Everyone`,
      UseExternalEmojis: `Use External Emojis`,
      ViewGuildInsights: `View Guild/Server Insights`,
      Connect: `Connect`,
      Speak: `Speak`,
      MuteMembers: `Mute Members`,
      DeafenMembers: `Deafen Members`,
      MoveMembers: `Move Members`,
      UseVAD: `Use Voice Activity Detection`,
      ChangeNickname: `Change Nickname`,
      ManageNicknames: `Manage Nicknames`,
      ManageRoles: `Manage Roles`,
      ManageWebhooks: `Manage Webhooks`,
      ManageEmojisAndStickers: `Manage Emojis and Stickers`,
      UseApplicationCommands: `Use Application Commands`,
      RequestToSpeak: `Request to Speak`,
      ManageThreads: `Manage Threads`,
      CreatePublicThreads: `Create Public Threads`,
      CreatePrivateThreads: `Create Private Threads`,
      UseExternalStickers: `Use External Stickers`,
      SendMessagesInThreads: `Send Messages in Threads`,
      UseEmbeddedActivities: `Start Embedded Activities`,
      ModerateMembers: `Moderate Members`,
      ManageEvents: `Manage Events`,
      ManagePermissions: `Manage Permissions`,
    },
  },
  punishments: {
    warn: `Warn`,
    ban: `Ban`,
    kick: `Kick`,
    tempban: `Temp-Ban`,
    channelban: `Channel-Ban`,
    tempchannelban: `Temp-Channel-Ban`,
    tempmute: `Temp-Mute`,
  },
  commandTypes: {
    slashCommands: `Slash Commands`,
    textCommands: `Text Commands`,
  },
  languages: {
    en: `English | Finished`,
  },
  deleteReasons: {
    deleteCommand: `Delete Commands`,
    deleteReply: `Delete Reply`,
    deleteBlacklist: `Ayako Blacklists`,
    leveling: `Ayako Leveling`,
    disboard: `Ayako DISBOARD Reminder`,
    antivirus: `Ayako Anti-Virus`,
    antispam: `Ayako Anti-Spam`,
    cooldown: `Ayako Cooldowns`,
    abortedMod: `Aborted Mod Command`,
    afk: `Ayako AFK`,
  },
  regions: {
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
    'application.commands': 'Use Slash Commands',
    'applicaiton.commands.update': 'Update Slash Commands',
    'application.commands.permissions.update': 'Update Slash Command Permissions',
  },
  Scopes: 'Scopes',
  Result: `Result`,
  stagePrivacyLevels: [`Public`, `Server Only`],
  none: `None`,
  defaultValuesLog: (oldValue: string, newValue: string) =>
    `__Before:__\n${oldValue}\n\n__After:__\n${newValue}`,
  reason: `Reason`,
  No: `No`,
  Yes: `Yes`,
  duration: `Duration`,
  attention: `Attention`,
  Embeds: `Embeds`,
  unknown: `Unknown`,
  error: `Error`,
  content: `Content`,
  name: `Name`,
  optional: `Optional`,
  required: `Required`,
  small: `Small`,
  joinedAt: `Joined At`,
  createdAt: `Created At`,
  roles: `Roles`,
  large: `Large`,
  loading: `Loading`,
  Enabled: `Enabled`,
  Disabled: `Disabled`,
  Number: `Number`,
  Punishment: `Punishment`,
  noReasonProvided: `No Reason provided`,
  Aborted: `Aborted`,
  Description: `Description`,
  Command: `Command`,
  Type: `Type`,
  noAliases: `No Aliases`,
  Default: `Default`,
  Level: `Level`,
  End: 'End',
  Message: 'Message',
  Added: 'Added',
  Removed: 'Removed',
  Changed: 'Changed',
  Member: 'Member',
  Role: 'Role',
  Tier: 'Tier',
  Channel: 'Channel',
  Emoji: 'Emoji',
  User: 'User',
  Application: 'Application',
  Bot: 'Bot',
  Flags: 'Flags',
  ScheduledEvent: 'Scheduled Event',
  Webhook: 'Webhook',
  color: 'Color',
};
