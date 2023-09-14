import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';
import error from '../error.js';
import { API } from '../../Client.js';
import * as CT from '../../../Typings/CustomTypings';
// eslint-disable-next-line import/no-cycle
import cache from '../cache.js';
import * as Classes from '../../Other/classes.js';

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
  client: Discord.Client,
 ) =>
  (guild ? cache.apis.get(guild.id) ?? API : API).channels
   .createMessage(channelId, {
    ...payload,
    message_reference: payload.message_reference
     ? { ...payload.message_reference, fail_if_not_exists: false }
     : undefined,
   })
   .then((m) => new Classes.Message(client, m))
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
   .then((m) => new Classes.Message(message.client, m))
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
   .then((m) => new Classes.Message(message.client, m))
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
   .then((m) => new Classes.Message(guild.client, m))
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
   .then((users) => {
    const parsed = users.map((u) => new Classes.User(message.client, u));
    parsed.forEach((p) => {
     if (
      message.reactions.cache
       .get(resolvedEmoji.id ?? resolvedEmoji.name ?? '')
       ?.users.cache.get(p.id)
     ) {
      return;
     }

     message.reactions.cache
      .get(resolvedEmoji.id ?? resolvedEmoji.name ?? '')
      ?.users.cache.set(p.id, p);
    });
   })
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
  (cache.apis.get(channel.guild.id) ?? API).channels
   .edit(channel.id, body)
   .then((c) => Classes.Channel(channel.client, c, channel.guild))
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 get: (guild: Discord.Guild, id: string) =>
  guild.channels.cache.get(id) ??
  (guild ? cache.apis.get(guild.id) ?? API : API).channels
   .get(id)
   .then((c) => {
    const parsed = Classes.Channel(guild.client, c, guild);

    if (guild.channels.cache.get(parsed.id)) return parsed;
    if (![Discord.ChannelType.DM, Discord.ChannelType.GroupDM].includes(parsed.type)) {
     guild.channels.cache.set(parsed.id, parsed as Discord.GuildBasedChannel);
    }

    return parsed;
   })
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 delete: (guild: Discord.Guild, channelId: string) =>
  (cache.apis.get(guild.id) ?? API).channels
   .delete(channelId)
   .then((c) => Classes.Channel(guild.client, c, guild))
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getMessages: (
  channel: Discord.GuildTextBasedChannel,
  query?: Discord.RESTGetAPIChannelMessagesQuery,
 ) =>
  (channel.guild ? cache.apis.get(channel.guild.id) ?? API : API).channels
   .getMessages(channel.id, query)
   .then((msgs) => {
    const parsed = msgs.map((m) => new Classes.Message(channel.client, m));
    parsed.forEach((p) => {
     if (channel.messages.cache.get(p.id)) return;
     channel.messages.cache.set(p.id, p);
    });
    return parsed;
   })
   .catch((e) => {
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
   .then((m) => new Classes.Message(message.client, m))
   .catch((e) => {
    error(message.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getPins: (channel: Discord.GuildTextBasedChannel) =>
  (channel.guild ? cache.apis.get(channel.guild.id) ?? API : API).channels
   .getPins(channel.id)
   .then((msgs) => {
    const parsed = msgs.map((msg) => new Classes.Message(channel.client, msg));
    parsed.forEach((p) => {
     if (channel.messages.cache.get(p.id)) return;
     channel.messages.cache.set(p.id, p);
    });
    return parsed;
   })
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
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
   .then((c) => ({ sourceChannelId: c.channel_id, createdWebhookId: c.webhook_id }))
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
   .then((i) => new Classes.Invite(channel.client, i))
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getInvites: (channel: Discord.GuildChannel) =>
  (channel.guild ? cache.apis.get(channel.guild.id) ?? API : API).channels
   .getInvites(channel.id)
   .then((invites) => {
    const parsed = invites.map((i) => new Classes.Invite(channel.client, i));
    parsed.forEach((p) => {
     if (channel.guild.invites.cache.get(p.code)) return;
     channel.guild.invites.cache.set(p.code, p);
    });
    return parsed;
   })
   .catch((e) => {
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
   .then((t) => Classes.Channel<10>(channel.client, t, channel.guild))
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 createForumThread: (channel: Discord.ForumChannel, body: StartForumThreadOptions) =>
  (cache.apis.get(channel.guild.id) ?? API).channels
   .createForumThread(channel.id, body)
   .then((t) => Classes.Channel(channel.client, t, channel.guild))
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getArchivedThreads: (
  channel: Discord.NewsChannel | Discord.TextChannel | Discord.ForumChannel,
  status: 'private' | 'public',
  query: Discord.RESTGetAPIChannelThreadsArchivedQuery,
 ) =>
  (channel.guild ? cache.apis.get(channel.guild.id) ?? API : API).channels
   .getArchivedThreads(channel.id, status, query)
   .then((res) => {
    const parsed = res.threads.map((t) => Classes.Channel<10>(channel.client, t, channel.guild));
    parsed.forEach((p) => {
     if (channel.threads.cache.get(p.id)) return;
     channel.threads.cache.set(
      p.id,
      p as Discord.ThreadChannel<true> & Discord.ThreadChannel<false>,
     );
    });
    return parsed;
   })
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getJoinedPrivateArchivedThreads: (
  channel: Discord.NewsChannel | Discord.TextChannel | Discord.ForumChannel,
  query: Discord.RESTGetAPIChannelThreadsArchivedQuery,
 ) =>
  (channel.guild ? cache.apis.get(channel.guild.id) ?? API : API).channels
   .getJoinedPrivateArchivedThreads(channel.id, query)
   .then((res) => {
    const parsed = res.threads.map((t) => Classes.Channel<10>(channel.client, t, channel.guild));
    parsed.forEach((p) => {
     if (channel.threads.cache.get(p.id)) return;
     channel.threads.cache.set(
      p.id,
      p as Discord.ThreadChannel<true> & Discord.ThreadChannel<false>,
     );
    });
    return parsed;
   })
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getWebhooks: (channel: Discord.GuildTextBasedChannel | Discord.ForumChannel) =>
  (channel.guild ? cache.apis.get(channel.guild.id) ?? API : API).channels
   .getWebhooks(channel.id)
   .then((webhooks) => webhooks.map((w) => new Classes.Webhook(channel.client, w)))
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
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
  (cache.apis.get(guild.id) ?? API).channels
   .createWebhook(channelId, body)
   .then((w) => new Classes.Webhook(guild.client, w))
   .catch((e) => {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
 getMessage: (channel: Discord.GuildTextBasedChannel, messageId: string) =>
  channel.messages.cache.get(messageId) ??
  (cache.apis.get(channel.guild.id) ?? API).channels
   .getMessage(channel.id, messageId)
   .then((m) => {
    const parsed = new Classes.Message(channel.guild.client, m);
    if (channel.messages.cache.get(parsed.id)) return parsed;
    channel.messages.cache.set(parsed.id, parsed);
    return parsed;
   })
   .catch((e) => {
    error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
    return e as Discord.DiscordAPIError;
   }),
};
