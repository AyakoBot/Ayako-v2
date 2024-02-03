import importCache from '../importCache/BaseClient/UtilModules/requestHandler/channels.js';

interface Channels {
 sendMessage: typeof importCache.sendMessage.file.default;
 replyMsg: typeof importCache.replyMsg.file.default;
 editMsg: typeof importCache.editMsg.file.default;
 editMessage: typeof importCache.editMessage.file.default;
 getReactions: typeof importCache.getReactions.file.default;
 deleteOwnReaction: typeof importCache.deleteOwnReaction.file.default;
 deleteUserReaction: typeof importCache.deleteUserReaction.file.default;
 deleteAllReactions: typeof importCache.deleteAllReactions.file.default;
 deleteAllReactionsOfEmoji: typeof importCache.deleteAllReactionsOfEmoji.file.default;
 addReaction: typeof importCache.addReaction.file.default;
 edit: typeof importCache.edit.file.default;
 get: typeof importCache.get.file.default;
 delete: typeof importCache.delete.file.default;
 getMessages: typeof importCache.getMessages.file.default;
 showTyping: typeof importCache.showTyping.file.default;
 pin: typeof importCache.pin.file.default;
 deleteMessage: typeof importCache.deleteMessage.file.default;
 bulkDelete: typeof importCache.bulkDelete.file.default;
 crosspostMessage: typeof importCache.crosspostMessage.file.default;
 getPins: typeof importCache.getPins.file.default;
 unpin: typeof importCache.unpin.file.default;
 followAnnouncements: typeof importCache.followAnnouncements.file.default;
 createInvite: typeof importCache.createInvite.file.default;
 getInvites: typeof importCache.getInvites.file.default;
 createThread: typeof importCache.createThread.file.default;
 createForumThread: typeof importCache.createForumThread.file.default;
 getArchivedThreads: typeof importCache.getArchivedThreads.file.default;
 getJoinedPrivateArchivedThreads: typeof importCache.getJoinedPrivateArchivedThreads.file.default;
 getWebhooks: typeof importCache.getWebhooks.file.default;
 editPermissionOverwrite: typeof importCache.editPermissionOverwrite.file.default;
 deletePermissionOverwrite: typeof importCache.deletePermissionOverwrite.file.default;
 createWebhook: typeof importCache.createWebhook.file.default;
 getMessage: typeof importCache.getMessage.file.default;
}

/**
 * An object containing methods for handling channel-related requests.
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
 * @property {Function} crosspostMessage
 * - Crossposts a message to another channel.
 * @property {Function} getPins
 * - Gets pinned messages from a channel.
 * @property {Function} unpin
 * - Unpins a message from a channel.
 * @property {Function} followAnnouncements
 * - Follows announcements in a channel.
 * @property {Function} createInvite
 * - Creates an invite to a channel.
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
const channels: Channels = {
 sendMessage: importCache.sendMessage.file.default,
 replyMsg: importCache.replyMsg.file.default,
 editMsg: importCache.editMsg.file.default,
 editMessage: importCache.editMessage.file.default,
 getReactions: importCache.getReactions.file.default,
 deleteOwnReaction: importCache.deleteOwnReaction.file.default,
 deleteUserReaction: importCache.deleteUserReaction.file.default,
 deleteAllReactions: importCache.deleteAllReactions.file.default,
 deleteAllReactionsOfEmoji: importCache.deleteAllReactionsOfEmoji.file.default,
 addReaction: importCache.addReaction.file.default,
 edit: importCache.edit.file.default,
 get: importCache.get.file.default,
 delete: importCache.delete.file.default,
 getMessages: importCache.getMessages.file.default,
 showTyping: importCache.showTyping.file.default,
 pin: importCache.pin.file.default,
 deleteMessage: importCache.deleteMessage.file.default,
 bulkDelete: importCache.bulkDelete.file.default,
 crosspostMessage: importCache.crosspostMessage.file.default,
 getPins: importCache.getPins.file.default,
 unpin: importCache.unpin.file.default,
 followAnnouncements: importCache.followAnnouncements.file.default,
 createInvite: importCache.createInvite.file.default,
 getInvites: importCache.getInvites.file.default,
 createThread: importCache.createThread.file.default,
 createForumThread: importCache.createForumThread.file.default,
 getArchivedThreads: importCache.getArchivedThreads.file.default,
 getJoinedPrivateArchivedThreads: importCache.getJoinedPrivateArchivedThreads.file.default,
 getWebhooks: importCache.getWebhooks.file.default,
 editPermissionOverwrite: importCache.editPermissionOverwrite.file.default,
 deletePermissionOverwrite: importCache.deletePermissionOverwrite.file.default,
 createWebhook: importCache.createWebhook.file.default,
 getMessage: importCache.getMessage.file.default,
};

export default channels;
