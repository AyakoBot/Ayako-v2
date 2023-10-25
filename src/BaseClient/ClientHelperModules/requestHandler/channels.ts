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

/**
 * Sends a message to a Discord channel.
 * @param guild The guild where the channel is located.
 * @param channelId The ID of the channel where the message will be sent.
 * @param payload The message content and options.
 * @param client The Discord client instance.
 * @returns A Promise that resolves to a new Message object if the message was sent successfully,
 * or rejects with a DiscordAPIError if an error occurred.
 */
const sendMessage = (
 guild: Discord.Guild | undefined | null,
 channelId: string,
 payload: Discord.RESTPostAPIChannelMessageJSONBody & {
  files?: Discord.RawFile[];
 },
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
  .catch((e: Discord.DiscordAPIError) => {
   if (guild) error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Sends a reply message to a Discord channel.
 * @param message The original message to reply to.
 * @param payload The message payload to send.
 * @returns A Promise that resolves with the sent message, or rejects with a DiscordAPIError.
 */
const replyMsg = (
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
  });

/**
 * Edits a message in a channel.
 * @param message - The message to edit.
 * @param payload - The new message content and options.
 * @returns A promise that resolves with the edited message, or rejects with a DiscordAPIError.
 */
const editMsg = (
 message: Discord.Message<true>,
 payload: CT.Argument<DiscordCore.ChannelsAPI['editMessage'], 2>,
) =>
 (cache.apis.get(message.guild.id) ?? API).channels
  .editMessage(message.channel.id, message.id, payload)
  .then((m) => new Classes.Message(message.client, m))
  .catch((e) => {
   error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits a message in a channel.
 * @param guild The guild where the channel belongs.
 * @param channelId The ID of the channel where the message is located.
 * @param messageId The ID of the message to edit.
 * @param payload The new message content.
 * @returns A Promise that resolves with the edited message or rejects with a DiscordAPIError.
 */
const editMessage = (
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
  });

/**
 * Retrieves a list of users who reacted with a specific emoji to a message.
 * @param message The message to retrieve reactions from.
 * @param emoji The emoji to retrieve reactions for.
 * @param query Optional query parameters to filter the results.
 * @returns A promise that resolves with an array of users who reacted with the specified emoji.
 */
const getReactions = (
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

    if (
     (resolvedEmoji.id ?? resolvedEmoji.name) &&
     !message.reactions.cache.get(resolvedEmoji.id ?? resolvedEmoji.name ?? '')
    ) {
     message.reactions.cache.set(
      resolvedEmoji.id ?? resolvedEmoji.name ?? '',
      new Classes.MessageReaction(
       message.client,
       {
        count: parsed.length,
        emoji: {
         id: resolvedEmoji.id ?? null,
         name: resolvedEmoji.name ?? null,
         animated: resolvedEmoji.animated,
        },
        me: false,
       },
       message,
      ),
     );
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
};

/**
 * Deletes the reaction of the bot on a message.
 * @param message - The message object to delete the reaction from.
 * @param emoji - The emoji to delete from the message.
 * @returns A promise that resolves with the deleted reaction or rejects with an error.
 */
const deleteOwnReaction = (message: Discord.Message<true>, emoji: string) => {
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
};

/**
 * Deletes a user's reaction from a message.
 * @param message The message object from which the reaction is to be deleted.
 * @param userId The ID of the user whose reaction is to be deleted.
 * @param emoji The emoji to be deleted.
 * @returns A promise that resolves with the deleted reaction, or rejects with an error.
 */
const deleteUserReaction = (message: Discord.Message<true>, userId: string, emoji: string) => {
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
};

/**
 * Deletes all reactions from a message in a channel.
 * @param message The message to delete reactions from.
 * @returns A promise that resolves with the deleted message, or rejects with a DiscordAPIError.
 */
const deleteAllReactions = (message: Discord.Message<true>) =>
 (cache.apis.get(message.guild.id) ?? API).channels
  .deleteAllMessageReactions(message.channel.id, message.id)
  .catch((e) => {
   error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Deletes all reactions of a specific emoji from a message.
 * @param message The message object from which to delete the reactions.
 * @param emoji The emoji to delete reactions for.
 * @returns A promise that resolves with a DiscordAPIError if the operation fails,
 * or void if it succeeds.
 */
const deleteAllReactionsOfEmoji = (message: Discord.Message<true>, emoji: string) => {
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
};

/**
 * Adds a reaction to a message.
 * @param message The message to add the reaction to.
 * @param emoji The emoji to add as a reaction.
 * @returns A Promise that resolves with the DiscordAPIError if the reaction could not be added.
 */
const addReaction = (message: Discord.Message<true>, emoji: string) => {
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
};

/**
 * Edits a guild-based channel or thread channel.
 * @param channel - The channel to edit.
 * @param body - The new channel data.
 * @returns A promise that resolves with the updated channel, or rejects with a DiscordAPIError.
 */
const edit = (
 channel: Discord.GuildBasedChannel | Discord.ThreadChannel,
 body: Discord.RESTPatchAPIChannelJSONBody,
) =>
 (cache.apis.get(channel.guild.id) ?? API).channels
  .edit(channel.id, body)
  .then((c) => Classes.Channel(channel.client, c, channel.guild))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves a channel from the cache or the Discord API.
 * @param guild The guild that the channel belongs to.
 * @param id The ID of the channel to retrieve.
 * @returns A Promise that resolves with the retrieved channel.
 */
const get = async (guild: Discord.Guild, id: string) =>
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
  });

/**
 * Deletes a channel from the given guild.
 * @param guild - The guild where the channel is located.
 * @param channelId - The ID of the channel to delete.
 * @returns A promise that resolves with the deleted channel, or rejects with a DiscordAPIError.
 */
const del = (guild: Discord.Guild, channelId: string) =>
 (cache.apis.get(guild.id) ?? API).channels
  .delete(channelId)
  .then((c) => Classes.Channel(guild.client, c, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves messages from a guild text-based channel.
 * @param channel - The guild text-based channel to retrieve messages from.
 * @param query - The query parameters to include in the request.
 * @returns A promise that resolves with an array of parsed messages.
 */
const getMessages = (
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
  });

/**
 * Shows typing indicator in the given guild text-based channel.
 * @param channel - The guild text-based channel to show typing indicator in.
 * @returns A promise that resolves when the typing indicator is successfully shown,
 * or rejects with an error.
 */
const showTyping = (channel: Discord.GuildTextBasedChannel) =>
 (cache.apis.get(channel.guild.id) ?? API).channels.showTyping(channel.id).catch((e) => {
  error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
 });

/**
 * Pins a message in a guild text-based channel.
 * @param channel - The guild text-based channel where the message will be pinned.
 * @param message - The message to be pinned.
 * @returns A promise that resolves with the pinned message, or rejects with a DiscordAPIError.
 */
const pin = (channel: Discord.GuildTextBasedChannel, message: Discord.Message<true>) =>
 (cache.apis.get(channel.guild.id) ?? API).channels
  .pinMessage(channel.id, message.id)
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Deletes a message from a channel.
 * @param message The message to be deleted.
 * @returns A promise that resolves with the deleted message, or rejects with a DiscordAPIError.
 */
const deleteMessage = (message: Discord.Message<true>) =>
 (cache.apis.get(message.guild.id) ?? API).channels
  .deleteMessage(message.channelId, message.id)
  .catch((e) => {
   error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Deletes multiple messages in a guild text-based channel.
 * @param channel - The guild text-based channel where the messages are located.
 * @param messages - An array of message IDs to delete.
 * @returns A promise that resolves with the deleted messages or rejects with a DiscordAPIError.
 */
const bulkDelete = (channel: Discord.GuildTextBasedChannel, messages: string[]) =>
 (cache.apis.get(channel.guild.id) ?? API).channels
  .bulkDeleteMessages(channel.id, messages)
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Crossposts a message to all following channels.
 * @param message - The message to crosspost.
 * @returns A promise that resolves with the new message object if successful,
 * or rejects with an error.
 */
const crosspostMessage = (message: Discord.Message<true>) =>
 (cache.apis.get(message.guild.id) ?? API).channels
  .crosspostMessage(message.channelId, message.id)
  .then((m) => new Classes.Message(message.client, m))
  .catch((e) => {
   error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves the pinned messages in a guild text-based channel.
 * @param channel - The guild text-based channel to retrieve pinned messages from.
 * @returns A promise that resolves with an array of parsed messages.
 */
const getPins = (channel: Discord.GuildTextBasedChannel) =>
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
  });

/**
 * Unpins a message from a channel.
 * @param message The message to unpin.
 * @returns A promise that resolves with the unpinned message, or rejects with an error.
 */
const unpin = (message: Discord.Message<true>) =>
 (cache.apis.get(message.guild.id) ?? API).channels
  .unpinMessage(message.channelId, message.id)
  .catch((e) => {
   error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Follows announcements from a specified channel in a guild text-based channel.
 * @param channel - The guild text-based channel to follow announcements in.
 * @param followedChannelId - The ID of the channel to follow announcements from.
 * @returns A Promise that resolves to an object containing the ID of the source channel
 * and the ID of the created webhook,
 * or rejects with a DiscordAPIError.
 */
const followAnnouncements = (channel: Discord.GuildTextBasedChannel, followedChannelId: string) =>
 (cache.apis.get(channel.guild.id) ?? API).channels
  .followAnnouncements(channel.id, followedChannelId)
  .then((c) => ({ sourceChannelId: c.channel_id, createdWebhookId: c.webhook_id }))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Creates an invite for a guild-based channel.
 * @param channel - The guild-based channel to create the invite for.
 * @param body - The invite data to send.
 * @param reason - The reason for creating the invite.
 * @returns A promise that resolves with the created invite or rejects with a DiscordAPIError.
 */
const createInvite = (
 channel: Discord.GuildBasedChannel,
 body: Discord.RESTPostAPIChannelInviteJSONBody,
 reason?: string,
) =>
 (cache.apis.get(channel.guild.id) ?? API).channels
  .createInvite(channel.id, body, { reason })
  .then((i) => new Classes.Invite(channel.client, i))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves the invites for a given guild-based channel.
 * @param channel - The guild-based channel to retrieve invites for.
 * @returns A promise that resolves with an array of parsed invite objects.
 */
const getInvites = async (channel: Discord.GuildBasedChannel) =>
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
  });

/**
 * Creates a thread in a guild text-based channel.
 * @param channel - The guild text-based channel where the thread will be created.
 * @param body - The REST API JSON body for creating the thread.
 * @param messageId - The ID of the message to create the thread from.
 * @returns A promise that resolves with the created thread or rejects with a DiscordAPIError.
 */
const createThread = (
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
  });

/**
 * Creates a new forum thread in the specified channel.
 * @param channel - The forum channel where the thread will be created.
 * @param body - The options for the new forum thread.
 * @returns A promise that resolves with the newly created forum thread channel.
 */
const createForumThread = (channel: Discord.ForumChannel, body: StartForumThreadOptions) =>
 (cache.apis.get(channel.guild.id) ?? API).channels
  .createForumThread(channel.id, body)
  .then((t) => Classes.Channel(channel.client, t, channel.guild))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves a list of archived threads in a channel.
 * @param channel - The channel to retrieve archived threads from.
 * @param status - The status of the threads to retrieve. Can be either 'private' or 'public'.
 * @param query - The query parameters to include in the request.
 * @returns A Promise that resolves with an array of parsed thread objects.
 */
const getArchivedThreads = (
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
  });

/**
 * Retrieves the joined private archived threads for a given channel.
 * @param channel - The channel to retrieve the threads for.
 * @param query - The query parameters for the request.
 * @returns A promise that resolves with an array of parsed thread channels.
 */
const getJoinedPrivateArchivedThreads = (
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
  });

/**
 * Retrieves the webhooks for a given guild text-based channel or forum channel.
 * @param channel - The guild text-based channel or forum channel to retrieve webhooks for.
 * @returns A promise that resolves with an array of webhooks for the given channel.
 */
const getWebhooks = (channel: Discord.GuildTextBasedChannel | Discord.ForumChannel) =>
 (channel.guild ? cache.apis.get(channel.guild.id) ?? API : API).channels
  .getWebhooks(channel.id)
  .then((webhooks) => webhooks.map((w) => new Classes.Webhook(channel.client, w)))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Edits a permission overwrite for a guild-based channel.
 * @param channel - The guild-based channel to edit the permission overwrite for.
 * @param overwriteId - The ID of the permission overwrite to edit.
 * @param body - The new permission overwrite data.
 * @param reason - The reason for editing the permission overwrite.
 * @returns A promise that resolves with the updated permission overwrite,
 * or rejects with a DiscordAPIError.
 */
const editPermissionOverwrite = (
 channel: Discord.GuildBasedChannel,
 overwriteId: string,
 body: Discord.RESTPutAPIChannelPermissionJSONBody,
 reason?: string,
) =>
 (cache.apis.get(channel.guild.id) ?? API).channels
  .editPermissionOverwrite(channel.id, overwriteId, body, { reason })
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Deletes a permission overwrite for a channel in a guild.
 * @param channel - The guild-based channel where the permission overwrite is being deleted.
 * @param overwriteId - The ID of the permission overwrite to delete.
 * @param reason - The reason for deleting the permission overwrite.
 * @returns A promise that resolves with the deleted permission overwrite,
 * or rejects with a DiscordAPIError.
 */
const deletePermissionOverwrite = (
 channel: Discord.GuildBasedChannel,
 overwriteId: string,
 reason?: string,
) =>
 (cache.apis.get(channel.guild.id) ?? API).channels
  .deletePermissionOverwrite(channel.id, overwriteId, { reason })
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Creates a webhook for a given guild and channel with the provided data.
 * @param guild - The guild where the webhook will be created.
 * @param channelId - The ID of the channel where the webhook will be created.
 * @param body - The data to be sent in the request body.
 * @returns A promise that resolves with a new Webhook object if successful,
 * or rejects with a DiscordAPIError if unsuccessful.
 */
const createWebhook = async (
 guild: Discord.Guild,
 channelId: string,
 body: Discord.RESTPostAPIChannelWebhookJSONBody,
) =>
 (cache.apis.get(guild.id) ?? API).channels
  .createWebhook(channelId, {
   ...body,
   avatar: body.avatar ? await Discord.DataResolver.resolveImage(body.avatar) : body.avatar,
  })
  .then((w) => new Classes.Webhook(guild.client, w))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });

/**
 * Retrieves a message from a guild text-based channel by its ID.
 * @param channel - The guild text-based channel where the message is located.
 * @param messageId - The ID of the message to retrieve.
 * @returns A Promise that resolves with the retrieved message or rejects with an error.
 */
const getMessage = async (channel: Discord.GuildTextBasedChannel, messageId: string) =>
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
  });

/**
 * An object containing methods for handling channel-related requests.
 * @typedef {Object} ChannelRequestHandler
 * @property {Function} sendMessage
 * - Sends a message to a channel.
 * @property {Function} replyMsg
 * - Replies to a message in a channel.
 * @property {Function} editMsg
 * - Edits a message in a channel.
 * @property {Function} editMessage
 * - Alias for editMsg.
 * @property {Function} getReactions
 * - Gets reactions for a message in a channel.
 * @property {Function} deleteOwnReaction
 * - Deletes the user's own reaction to a message in a channel.
 * @property {Function} deleteUserReaction
 * - Deletes another user's reaction to a message in a channel.
 * @property {Function} deleteAllReactions
 * - Deletes all reactions to a message in a channel.
 * @property {Function} deleteAllReactionsOfEmoji
 * - Deletes all reactions of a specific emoji to a message in a channel.
 * @property {Function} addReaction
 * - Adds a reaction to a message in a channel.
 * @property {Function} edit
 * - Edits a message in a channel.
 * @property {Function} get
 * - Gets a message from a channel.
 * @property {Function} delete
 * - Deletes a message from a channel.
 * @property {Function} getMessages
 * - Gets messages from a channel.
 * @property {Function} showTyping
 * - Shows that the user is typing in a channel.
 * @property {Function} pin
 * - Pins a message in a channel.
 * @property {Function} deleteMessage
 * - Deletes a message from a channel.
 * @property {Function} bulkDelete
 * - Deletes multiple messages from a channel.
 * @property {Function} crosspostMessage - Crossposts a message to another channel.
 * @property {Function} getPins
 * - Gets pinned messages from a channel.
 * @property {Function} unpin
 * - Unpins a message from a channel.
 * @property {Function} followAnnouncements
 * - Follows announcements in a channel.
 * @property {Function} createInvite - Creates an invite to a channel.
 * @property {Function} getInvites
 * - Gets invites to a channel.
 * @property {Function} createThread
 * - Creates a thread in a channel.
 * @property {Function} createForumThread
 * - Creates a forum thread in a channel.
 * @property {Function} getArchivedThreads
 * - Gets archived threads in a channel.
 * @property {Function} getJoinedPrivateArchivedThreads
 * - Gets joined private archived threads in a channel.
 * @property {Function} getWebhooks
 * - Gets webhooks in a channel.
 * @property {Function} editPermissionOverwrite
 * - Edits a permission overwrite for a channel.
 * @property {Function} deletePermissionOverwrite
 * - Deletes a permission overwrite for a channel.
 * @property {Function} createWebhook
 * - Creates a webhook for a channel.
 * @property {Function} getMessage
 * - Gets a message from a channel.
 */
export default {
 sendMessage,
 replyMsg,
 editMsg,
 editMessage,
 getReactions,
 deleteOwnReaction,
 deleteUserReaction,
 deleteAllReactions,
 deleteAllReactionsOfEmoji,
 addReaction,
 edit,
 get,
 delete: del,
 getMessages,
 showTyping,
 pin,
 deleteMessage,
 bulkDelete,
 crosspostMessage,
 getPins,
 unpin,
 followAnnouncements,
 createInvite,
 getInvites,
 createThread,
 createForumThread,
 getArchivedThreads,
 getJoinedPrivateArchivedThreads,
 getWebhooks,
 editPermissionOverwrite,
 deletePermissionOverwrite,
 createWebhook,
 getMessage,
};
