import sendMessage from './channels/sendMessage.js';
import replyMsg from './channels/replyMsg.js';
import editMsg from './channels/editMsg.js';
import editMessage from './channels/editMessage.js';
import getReactions from './channels/getReactions.js';
import deleteOwnReaction from './channels/deleteOwnReaction.js';
import deleteUserReaction from './channels/deleteUserReaction.js';
import deleteAllReactions from './channels/deleteAllReactions.js';
import deleteAllReactionsOfEmoji from './channels/deleteAllReactionsOfEmoji.js';
import addReaction from './channels/addReaction.js';
import edit from './channels/edit.js';
import get from './channels/get.js';
import del from './channels/delete.js';
import getMessages from './channels/getMessages.js';
import showTyping from './channels/showTyping.js';
import pin from './channels/pin.js';
import deleteMessage from './channels/deleteMessage.js';
import bulkDelete from './channels/bulkDelete.js';
import crosspostMessage from './channels/crosspostMessage.js';
import getPins from './channels/getPins.js';
import unpin from './channels/unpin.js';
import followAnnouncements from './channels/followAnnouncements.js';
import createInvite from './channels/createInvite.js';
import getInvites from './channels/getInvites.js';
import createThread from './channels/createThread.js';
import createForumThread from './channels/createForumThread.js';
import getArchivedThreads from './channels/getArchivedThreads.js';
import getJoinedPrivateArchivedThreads from './channels/getJoinedPrivateArchivedThreads.js';
import getWebhooks from './channels/getWebhooks.js';
import editPermissionOverwrite from './channels/editPermissionOverwrite.js';
import deletePermissionOverwrite from './channels/deletePermissionOverwrite.js';
import createWebhook from './channels/createWebhook.js';
import getMessage from './channels/getMessage.js';

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
