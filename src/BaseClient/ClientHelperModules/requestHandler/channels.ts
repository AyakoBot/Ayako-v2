import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import error from '../error.js';
import { API } from '../../Client.js';
import * as CT from '../../../Typings/CustomTypings';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';

interface StartForumThreadOptions extends Discord.RESTPostAPIGuildForumThreadsJSONBody {
 message: Discord.RESTPostAPIGuildForumThreadsJSONBody['message'] & {
  files?: Discord.RawFile[];
 };
}
export default {
 sendMessage: (
  guild: Discord.Guild | undefined | null,
  channelId: string,
  payload: CT.Argument<DiscordCore.ChannelsAPI['createMessage'], 1>,
 ) =>
  (guild ? cache.apis.get(guild.id) ?? API : API).channels
   .createMessage(channelId, {
    ...payload,
    message_reference: payload.message_reference
     ? { ...payload.message_reference, fail_if_not_exists: false }
     : undefined,
   })
   .catch((e) => {
    if (guild) error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
   }),
 editMsg: (
  message: Discord.Message<true>,
  payload: CT.Argument<DiscordCore.ChannelsAPI['editMessage'], 2>,
 ) =>
  (cache.apis.get(message.guild.id) ?? API).channels
   .editMessage(message.channel.id, message.id, payload)
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 editMessage: (
  guild: Discord.Guild,
  channelId: string,
  messageId: string,
  payload: CT.Argument<DiscordCore.ChannelsAPI['editMessage'], 2>,
 ) =>
  (cache.apis.get(guild.id) ?? API).channels
   .editMessage(channelId, messageId, payload)
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getReactions: (
  message: Discord.Message<true>,
  emoji: string,
  query?: Discord.RESTGetAPIChannelMessageReactionUsersQuery,
 ) => {
  const resolvedEmoji = Discord.resolvePartialEmoji(emoji);
  if (!resolvedEmoji) {
   return new Discord.DiscordjsTypeError(
    Discord.DiscordjsErrorCodes.EmojiType,
    'emoji',
    'EmojiIdentifierResolvable',
   ) as Discord.DiscordAPIError;
  }

  return (cache.apis.get(message.guild.id) ?? API).channels
   .getMessageReactions(
    message.channel.id,
    message.id,
    resolvedEmoji.id
     ? `${resolvedEmoji.animated ? 'a:' : ''}${resolvedEmoji.name}:${resolvedEmoji.id}`
     : (resolvedEmoji.name as string),
    query,
   )
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   });
 },
 deleteOwnReaction: (message: Discord.Message<true>, emoji: string) => {
  const resolvedEmoji = Discord.resolvePartialEmoji(emoji);
  if (!resolvedEmoji) {
   return new Discord.DiscordjsTypeError(
    Discord.DiscordjsErrorCodes.EmojiType,
    'emoji',
    'EmojiIdentifierResolvable',
   ) as Discord.DiscordAPIError;
  }

  return (cache.apis.get(message.guild.id) ?? API).channels
   .deleteOwnMessageReaction(
    message.channel.id,
    message.id,
    resolvedEmoji.id
     ? `${resolvedEmoji.animated ? 'a:' : ''}${resolvedEmoji.name}:${resolvedEmoji.id}`
     : (resolvedEmoji.name as string),
   )
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   });
 },
 deleteUserReaction: (message: Discord.Message<true>, userId: string, emoji: string) => {
  const resolvedEmoji = Discord.resolvePartialEmoji(emoji);
  if (!resolvedEmoji) {
   return new Discord.DiscordjsTypeError(
    Discord.DiscordjsErrorCodes.EmojiType,
    'emoji',
    'EmojiIdentifierResolvable',
   ) as Discord.DiscordAPIError;
  }

  return (cache.apis.get(message.guild.id) ?? API).channels
   .deleteUserMessageReaction(
    message.channel.id,
    message.id,
    resolvedEmoji.id
     ? `${resolvedEmoji.animated ? 'a:' : ''}${resolvedEmoji.name}:${resolvedEmoji.id}`
     : (resolvedEmoji.name as string),
    userId,
   )
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   });
 },
 deleteAllReactions: (message: Discord.Message<true>) =>
  (cache.apis.get(message.guild.id) ?? API).channels
   .deleteAllMessageReactions(message.channel.id, message.id)
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 deleteAllReactionsOfEmoji: (message: Discord.Message<true>, emoji: string) => {
  const resolvedEmoji = Discord.resolvePartialEmoji(emoji);
  if (!resolvedEmoji) {
   return new Discord.DiscordjsTypeError(
    Discord.DiscordjsErrorCodes.EmojiType,
    'emoji',
    'EmojiIdentifierResolvable',
   ) as Discord.DiscordAPIError;
  }

  return (cache.apis.get(message.guild.id) ?? API).channels
   .deleteAllMessageReactionsForEmoji(
    message.channel.id,
    message.id,
    resolvedEmoji.id
     ? `${resolvedEmoji.animated ? 'a:' : ''}${resolvedEmoji.name}:${resolvedEmoji.id}`
     : (resolvedEmoji.name as string),
   )
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   });
 },
 addReaction: (message: Discord.Message<true>, emoji: string) => {
  const resolvedEmoji = Discord.resolvePartialEmoji(emoji);
  if (!resolvedEmoji) {
   return new Discord.DiscordjsTypeError(
    Discord.DiscordjsErrorCodes.EmojiType,
    'emoji',
    'EmojiIdentifierResolvable',
   ) as Discord.DiscordAPIError;
  }

  return (cache.apis.get(message.guild.id) ?? API).channels
   .addMessageReaction(
    message.channel.id,
    message.id,
    resolvedEmoji.id
     ? `${resolvedEmoji.animated ? 'a:' : ''}${resolvedEmoji.name}:${resolvedEmoji.id}`
     : (resolvedEmoji.name as string),
   )
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   });
 },
 edit: (
  channel: Discord.GuildChannel | Discord.ThreadChannel,
  body: Discord.RESTPatchAPIChannelJSONBody,
 ) =>
  (cache.apis.get(channel.guild.id) ?? API).channels.edit(channel.id, body).catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 get: (guild: Discord.Guild, id: string) =>
  API.channels.get(id).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 delete: (guild: Discord.Guild, channelId: string) =>
  (cache.apis.get(guild.id) ?? API).channels.delete(channelId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getMessages: (
  channel: Discord.GuildTextBasedChannel,
  query?: Discord.RESTGetAPIChannelMessagesQuery,
 ) =>
  API.channels.getMessages(channel.id, query).catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
   }),
 deleteMessage: (message: Discord.Message<true>) =>
  (cache.apis.get(message.guild.id) ?? API).channels
   .deleteMessage(message.channelId, message.id)
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 bulkDelete: (channel: Discord.GuildTextBasedChannel, messages: string[]) =>
  (cache.apis.get(channel.guild.id) ?? API).channels
   .bulkDeleteMessages(channel.id, messages)
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 crosspostMessage: (message: Discord.Message<true>) =>
  (cache.apis.get(message.guild.id) ?? API).channels
   .crosspostMessage(message.channelId, message.id)
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getPins: (guild: Discord.Guild, channelId: string) =>
  API.channels.getPins(channelId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 unpin: (message: Discord.Message<true>) =>
  (cache.apis.get(message.guild.id) ?? API).channels
   .unpinMessage(message.channelId, message.id)
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 followAnnouncements: (channel: Discord.GuildTextBasedChannel, followedChannelId: string) =>
  (cache.apis.get(channel.guild.id) ?? API).channels
   .followAnnouncements(channel.id, followedChannelId)
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
   }),
 getInvites: (channel: Discord.GuildChannel) =>
  API.channels.getInvites(channel.id).catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
   }),
 createForumThread: (channel: Discord.ForumChannel, body: StartForumThreadOptions) =>
  (cache.apis.get(channel.guild.id) ?? API).channels
   .createForumThread(channel.id, body)
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getArchivedThreads: (
  channel: Discord.GuildTextBasedChannel,
  status: 'private' | 'public',
  query: Discord.RESTGetAPIChannelThreadsArchivedQuery,
 ) =>
  API.channels.getArchivedThreads(channel.id, status, query).catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getJoinedPrivateArchivedThreads: (
  channel: Discord.GuildTextBasedChannel,
  query: Discord.RESTGetAPIChannelThreadsArchivedQuery,
 ) =>
  API.channels.getJoinedPrivateArchivedThreads(channel.id, query).catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getWebhooks: (guild: Discord.Guild, channelId: string) =>
  API.channels.getWebhooks(channelId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
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
    return e as Discord.DiscordAPIError;
   }),
 deletePermissionOverwrite: (channel: Discord.GuildChannel, overwriteId: string, reason?: string) =>
  (cache.apis.get(channel.guild.id) ?? API).channels
   .deletePermissionOverwrite(channel.id, overwriteId, { reason })
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 createWebhook: (
  guild: Discord.Guild,
  channelId: string,
  body: Discord.RESTPostAPIChannelWebhookJSONBody,
 ) =>
  (cache.apis.get(guild.id) ?? API).channels.createWebhook(channelId, body).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
 getMessage: (guild: Discord.Guild, channelId: string, messageId: string) =>
  (cache.apis.get(guild.id) ?? API).channels.getMessage(channelId, messageId).catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  }),
};
