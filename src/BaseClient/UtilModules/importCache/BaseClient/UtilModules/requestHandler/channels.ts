const self = {
 reload: async () => {
  self.file = () => import(`../../../../requestHandler/channels.js?version=${Date.now()}`);
 },
 file: () => import(`../../../../requestHandler/channels.js`),

 sendMessage: {
  reload: async () => {
   self.sendMessage.file = await import(
    `../../../../requestHandler/channels/sendMessage.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/sendMessage.js`),
 },
 replyMsg: {
  reload: async () => {
   self.replyMsg.file = await import(
    `../../../../requestHandler/channels/replyMsg.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/replyMsg.js`),
 },
 editMsg: {
  reload: async () => {
   self.editMsg.file = await import(
    `../../../../requestHandler/channels/editMsg.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/editMsg.js`),
 },
 editMessage: {
  reload: async () => {
   self.editMessage.file = await import(
    `../../../../requestHandler/channels/editMessage.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/editMessage.js`),
 },
 getReactions: {
  reload: async () => {
   self.getReactions.file = await import(
    `../../../../requestHandler/channels/getReactions.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/getReactions.js`),
 },
 deleteOwnReaction: {
  reload: async () => {
   self.deleteOwnReaction.file = await import(
    `../../../../requestHandler/channels/deleteOwnReaction.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/deleteOwnReaction.js`),
 },
 deleteUserReaction: {
  reload: async () => {
   self.deleteUserReaction.file = await import(
    `../../../../requestHandler/channels/deleteUserReaction.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/deleteUserReaction.js`),
 },
 deleteAllReactions: {
  reload: async () => {
   self.deleteAllReactions.file = await import(
    `../../../../requestHandler/channels/deleteAllReactions.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/deleteAllReactions.js`),
 },
 deleteAllReactionsOfEmoji: {
  reload: async () => {
   self.deleteAllReactionsOfEmoji.file = await import(
    `../../../../requestHandler/channels/deleteAllReactionsOfEmoji.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/deleteAllReactionsOfEmoji.js`),
 },
 addReaction: {
  reload: async () => {
   self.addReaction.file = await import(
    `../../../../requestHandler/channels/addReaction.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/addReaction.js`),
 },
 edit: {
  reload: async () => {
   self.edit.file = await import(
    `../../../../requestHandler/channels/edit.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/edit.js`),
 },
 get: {
  reload: async () => {
   self.get.file = await import(`../../../../requestHandler/channels/get.js?version=${Date.now()}`);
  },
  file: await import(`../../../../requestHandler/channels/get.js`),
 },
 delete: {
  reload: async () => {
   self.delete.file = await import(
    `../../../../requestHandler/channels/delete.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/delete.js`),
 },
 getMessages: {
  reload: async () => {
   self.getMessages.file = await import(
    `../../../../requestHandler/channels/getMessages.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/getMessages.js`),
 },
 showTyping: {
  reload: async () => {
   self.showTyping.file = await import(
    `../../../../requestHandler/channels/showTyping.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/showTyping.js`),
 },
 pin: {
  reload: async () => {
   self.pin.file = await import(`../../../../requestHandler/channels/pin.js?version=${Date.now()}`);
  },
  file: await import(`../../../../requestHandler/channels/pin.js`),
 },
 deleteMessage: {
  reload: async () => {
   self.deleteMessage.file = await import(
    `../../../../requestHandler/channels/deleteMessage.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/deleteMessage.js`),
 },
 bulkDelete: {
  reload: async () => {
   self.bulkDelete.file = await import(
    `../../../../requestHandler/channels/bulkDelete.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/bulkDelete.js`),
 },
 crosspostMessage: {
  reload: async () => {
   self.crosspostMessage.file = await import(
    `../../../../requestHandler/channels/crosspostMessage.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/crosspostMessage.js`),
 },
 getPins: {
  reload: async () => {
   self.getPins.file = await import(
    `../../../../requestHandler/channels/getPins.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/getPins.js`),
 },
 unpin: {
  reload: async () => {
   self.unpin.file = await import(
    `../../../../requestHandler/channels/unpin.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/unpin.js`),
 },
 followAnnouncements: {
  reload: async () => {
   self.followAnnouncements.file = await import(
    `../../../../requestHandler/channels/followAnnouncements.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/followAnnouncements.js`),
 },
 createInvite: {
  reload: async () => {
   self.createInvite.file = await import(
    `../../../../requestHandler/channels/createInvite.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/createInvite.js`),
 },
 getInvites: {
  reload: async () => {
   self.getInvites.file = await import(
    `../../../../requestHandler/channels/getInvites.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/getInvites.js`),
 },
 createThread: {
  reload: async () => {
   self.createThread.file = await import(
    `../../../../requestHandler/channels/createThread.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/createThread.js`),
 },
 createForumThread: {
  reload: async () => {
   self.createForumThread.file = await import(
    `../../../../requestHandler/channels/createForumThread.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/createForumThread.js`),
 },
 getArchivedThreads: {
  reload: async () => {
   self.getArchivedThreads.file = await import(
    `../../../../requestHandler/channels/getArchivedThreads.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/getArchivedThreads.js`),
 },
 getJoinedPrivateArchivedThreads: {
  reload: async () => {
   self.getJoinedPrivateArchivedThreads.file = await import(
    `../../../../requestHandler/channels/getJoinedPrivateArchivedThreads.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/getJoinedPrivateArchivedThreads.js`),
 },
 getWebhooks: {
  reload: async () => {
   self.getWebhooks.file = await import(
    `../../../../requestHandler/channels/getWebhooks.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/getWebhooks.js`),
 },
 editPermissionOverwrite: {
  reload: async () => {
   self.editPermissionOverwrite.file = await import(
    `../../../../requestHandler/channels/editPermissionOverwrite.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/editPermissionOverwrite.js`),
 },
 deletePermissionOverwrite: {
  reload: async () => {
   self.deletePermissionOverwrite.file = await import(
    `../../../../requestHandler/channels/deletePermissionOverwrite.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/deletePermissionOverwrite.js`),
 },
 createWebhook: {
  reload: async () => {
   self.createWebhook.file = await import(
    `../../../../requestHandler/channels/createWebhook.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/createWebhook.js`),
 },
 getMessage: {
  reload: async () => {
   self.getMessage.file = await import(
    `../../../../requestHandler/channels/getMessage.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/channels/getMessage.js`),
 },
};

export default self;
