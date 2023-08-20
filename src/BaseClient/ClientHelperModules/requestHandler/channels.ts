import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import error from '../error.js';
import { API } from '../../Client.js';
import * as CT from '../../../Typings/CustomTypings';
import cache from '../cache.js';

interface StartForumThreadOptions extends Discord.RESTPostAPIGuildForumThreadsJSONBody {
 message: Discord.RESTPostAPIGuildForumThreadsJSONBody['message'] & {
  files?: Discord.RawFile[];
 };
}

export default {
 sendMessage: (
  channel: Discord.GuildTextBasedChannel,
  payload: CT.Argument<DiscordCore.ChannelsAPI['createMessage'], 1>,
 ) =>
  (cache.apis.get(channel.guild.id) ?? API).channels
   .createMessage(channel.id, payload)
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 replyMsg: (
  message: Discord.Message<true>,
  payload: CT.Argument<DiscordCore.ChannelsAPI['createMessage'], 1>,
 ) =>
  (cache.apis.get(message.guild.id) ?? API).channels
   .createMessage(message.channel.id, {
    ...payload,
    message_reference: {
     message_id: message.id,
     channel_id: message.channelId,
     guild_id: message.guildId,
    },
   })
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 editMsg: (
  message: Discord.Message<true>,
  payload: CT.Argument<DiscordCore.ChannelsAPI['editMessage'], 2>,
 ) =>
  (cache.apis.get(message.guild.id) ?? API).channels
   .editMessage(message.channel.id, message.id, payload)
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 getReactions: (
  message: Discord.Message<true>,
  emoji: string,
  query?: Discord.RESTGetAPIChannelMessageReactionUsersQuery,
 ) =>
  (cache.apis.get(message.guild.id) ?? API).channels
   .getMessageReactions(message.channel.id, message.id, emoji, query)
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 deleteOwnReaction: (message: Discord.Message<true>, emoji: string) =>
  (cache.apis.get(message.guild.id) ?? API).channels
   .deleteOwnMessageReaction(message.channel.id, message.id, emoji)
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 deleteUserReaction: (message: Discord.Message<true>, userId: string, emoji: string) =>
  (cache.apis.get(message.guild.id) ?? API).channels
   .deleteUserMessageReaction(message.channel.id, message.id, emoji, userId)
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 deleteAllReactions: (message: Discord.Message<true>) =>
  (cache.apis.get(message.guild.id) ?? API).channels
   .deleteAllMessageReactions(message.channel.id, message.id)
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 deleteAllReactionsOfEmoji: (message: Discord.Message<true>, emoji: string) =>
  (cache.apis.get(message.guild.id) ?? API).channels
   .deleteAllMessageReactionsForEmoji(message.channel.id, message.id, emoji)
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 addReaction: (message: Discord.Message<true>, emoji: string) =>
  (cache.apis.get(message.guild.id) ?? API).channels
   .addMessageReaction(message.channel.id, message.id, emoji)
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 edit: (channel: Discord.GuildChannel, body: Discord.RESTPatchAPIChannelJSONBody) =>
  (cache.apis.get(channel.guild.id) ?? API).channels.edit(channel.id, body).catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 get: (guild: Discord.Guild, id: string) =>
  API.channels.get(id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 delete: (channel: Discord.GuildChannel) =>
  (cache.apis.get(channel.guild.id) ?? API).channels.delete(channel.id).catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getMessages: (
  channel: Discord.GuildTextBasedChannel,
  query?: Discord.RESTGetAPIChannelMessagesQuery,
 ) =>
  API.channels.getMessages(channel.id, query).catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 showTyping: (channel: Discord.GuildTextBasedChannel) =>
  (cache.apis.get(channel.guild.id) ?? API).channels.showTyping(channel.id).catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 pin: (channel: Discord.GuildTextBasedChannel, message: Discord.Message<true>) =>
  (cache.apis.get(channel.guild.id) ?? API).channels
   .pinMessage(channel.id, message.id)
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 deleteMessage: (message: Discord.Message<true>) =>
  (cache.apis.get(message.guild.id) ?? API).channels
   .deleteMessage(message.channelId, message.id)
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 bulkDelete: (channel: Discord.GuildTextBasedChannel, messages: string[]) =>
  (cache.apis.get(channel.guild.id) ?? API).channels
   .bulkDeleteMessages(channel.id, messages)
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 crosspostMessage: (message: Discord.Message<true>) =>
  (cache.apis.get(message.guild.id) ?? API).channels
   .crosspostMessage(message.channelId, message.id)
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 getPins: (channel: Discord.GuildTextBasedChannel) =>
  API.channels.getPins(channel.id).catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 unpin: (message: Discord.Message<true>) =>
  (cache.apis.get(message.guild.id) ?? API).channels
   .unpinMessage(message.channelId, message.id)
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 followAnnouncements: (channel: Discord.GuildTextBasedChannel, followedChannelId: string) =>
  (cache.apis.get(channel.guild.id) ?? API).channels
   .followAnnouncements(channel.id, followedChannelId)
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 createInvite: (
  channel: Discord.GuildChannel,
  body: Discord.RESTPostAPIChannelInviteJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(channel.guild.id) ?? API).channels
   .createInvite(channel.id, body, { reason })
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 getInvites: (channel: Discord.GuildChannel) =>
  API.channels.getInvites(channel.id).catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 createThread: (
  channel: Discord.GuildTextBasedChannel,
  body: Discord.RESTPostAPIChannelThreadsJSONBody,
  messageId?: string,
 ) =>
  (cache.apis.get(channel.guild.id) ?? API).channels
   .createThread(channel.id, body, messageId)
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 createForumThread: (channel: Discord.ForumChannel, body: StartForumThreadOptions) =>
  (cache.apis.get(channel.guild.id) ?? API).channels
   .createForumThread(channel.id, body)
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 getArchivedThreads: (
  channel: Discord.GuildTextBasedChannel,
  status: 'private' | 'public',
  query: Discord.RESTGetAPIChannelThreadsArchivedQuery,
 ) =>
  API.channels.getArchivedThreads(channel.id, status, query).catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getJoinedPrivateArchivedThreads: (
  channel: Discord.GuildTextBasedChannel,
  query: Discord.RESTGetAPIChannelThreadsArchivedQuery,
 ) =>
  API.channels.getJoinedPrivateArchivedThreads(channel.id, query).catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 getWebhooks: (channel: Discord.GuildTextBasedChannel) =>
  API.channels.getWebhooks(channel.id).catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
  }),
 editPermissionOverwrite: (
  channel: Discord.GuildChannel,
  overwriteId: string,
  body: Discord.RESTPutAPIChannelPermissionJSONBody,
  reason?: string,
 ) =>
  (cache.apis.get(channel.guild.id) ?? API).channels
   .editPermissionOverwrite(channel.id, overwriteId, body, { reason })
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
 deletePermissionOverwrite: (channel: Discord.GuildChannel, overwriteId: string, reason?: string) =>
  (cache.apis.get(channel.guild.id) ?? API).channels
   .deletePermissionOverwrite(channel.id, overwriteId, { reason })
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   }),
};
