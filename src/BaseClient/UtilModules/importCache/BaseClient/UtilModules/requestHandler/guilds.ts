const self = {
 reload: async () => {
  self.file = await import(`../../../../requestHandler/guilds.js?version=${Date.now()}`);
 },
 file: await import(`../../../../requestHandler/guilds.js`),

 edit: {
  reload: async () => {
   self.edit.file = await import(`../../../../requestHandler/guilds/edit.js?version=${Date.now()}`);
  },
  file: await import(`../../../../requestHandler/guilds/edit.js`),
 },
 delete: {
  reload: async () => {
   self.delete.file = await import(
    `../../../../requestHandler/guilds/delete.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/delete.js`),
 },
 getChannels: {
  reload: async () => {
   self.getChannels.file = await import(
    `../../../../requestHandler/guilds/getChannels.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getChannels.js`),
 },
 getWidgetImage: {
  reload: async () => {
   self.getWidgetImage.file = await import(
    `../../../../requestHandler/guilds/getWidgetImage.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getWidgetImage.js`),
 },
 getVanityURL: {
  reload: async () => {
   self.getVanityURL.file = await import(
    `../../../../requestHandler/guilds/getVanityURL.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getVanityURL.js`),
 },
 getWelcomeScreen: {
  reload: async () => {
   self.getWelcomeScreen.file = await import(
    `../../../../requestHandler/guilds/getWelcomeScreen.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getWelcomeScreen.js`),
 },
 editWelcomeScreen: {
  reload: async () => {
   self.editWelcomeScreen.file = await import(
    `../../../../requestHandler/guilds/editWelcomeScreen.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/editWelcomeScreen.js`),
 },
 getWidgetSettings: {
  reload: async () => {
   self.getWidgetSettings.file = await import(
    `../../../../requestHandler/guilds/getWidgetSettings.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getWidgetSettings.js`),
 },
 editWidgetSettings: {
  reload: async () => {
   self.editWidgetSettings.file = await import(
    `../../../../requestHandler/guilds/editWidgetSettings.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/editWidgetSettings.js`),
 },
 getWidget: {
  reload: async () => {
   self.getWidget.file = await import(
    `../../../../requestHandler/guilds/getWidget.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getWidget.js`),
 },
 getInvites: {
  reload: async () => {
   self.getInvites.file = await import(
    `../../../../requestHandler/guilds/getInvites.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getInvites.js`),
 },
 getIntegrations: {
  reload: async () => {
   self.getIntegrations.file = await import(
    `../../../../requestHandler/guilds/getIntegrations.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getIntegrations.js`),
 },
 deleteIntegration: {
  reload: async () => {
   self.deleteIntegration.file = await import(
    `../../../../requestHandler/guilds/deleteIntegration.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/deleteIntegration.js`),
 },
 getVoiceRegions: {
  reload: async () => {
   self.getVoiceRegions.file = await import(
    `../../../../requestHandler/guilds/getVoiceRegions.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getVoiceRegions.js`),
 },
 beginPrune: {
  reload: async () => {
   self.beginPrune.file = await import(
    `../../../../requestHandler/guilds/beginPrune.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/beginPrune.js`),
 },
 getAuditLogs: {
  reload: async () => {
   self.getAuditLogs.file = await import(
    `../../../../requestHandler/guilds/getAuditLogs.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getAuditLogs.js`),
 },
 getAutoModerationRules: {
  reload: async () => {
   self.getAutoModerationRules.file = await import(
    `../../../../requestHandler/guilds/getAutoModerationRules.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getAutoModerationRules.js`),
 },
 getAutoModerationRule: {
  reload: async () => {
   self.getAutoModerationRule.file = await import(
    `../../../../requestHandler/guilds/getAutoModerationRule.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getAutoModerationRule.js`),
 },
 createAutoModerationRule: {
  reload: async () => {
   self.createAutoModerationRule.file = await import(
    `../../../../requestHandler/guilds/createAutoModerationRule.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/createAutoModerationRule.js`),
 },
 editAutoModerationRule: {
  reload: async () => {
   self.editAutoModerationRule.file = await import(
    `../../../../requestHandler/guilds/editAutoModerationRule.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/editAutoModerationRule.js`),
 },
 deleteAutoModerationRule: {
  reload: async () => {
   self.deleteAutoModerationRule.file = await import(
    `../../../../requestHandler/guilds/deleteAutoModerationRule.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/deleteAutoModerationRule.js`),
 },
 getEmojis: {
  reload: async () => {
   self.getEmojis.file = await import(
    `../../../../requestHandler/guilds/getEmojis.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getEmojis.js`),
 },
 getEmoji: {
  reload: async () => {
   self.getEmoji.file = await import(
    `../../../../requestHandler/guilds/getEmoji.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getEmoji.js`),
 },
 createEmoji: {
  reload: async () => {
   self.createEmoji.file = await import(
    `../../../../requestHandler/guilds/createEmoji.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/createEmoji.js`),
 },
 editEmoji: {
  reload: async () => {
   self.editEmoji.file = await import(
    `../../../../requestHandler/guilds/editEmoji.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/editEmoji.js`),
 },
 deleteEmoji: {
  reload: async () => {
   self.deleteEmoji.file = await import(
    `../../../../requestHandler/guilds/deleteEmoji.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/deleteEmoji.js`),
 },
 getMembers: {
  reload: async () => {
   self.getMembers.file = await import(
    `../../../../requestHandler/guilds/getMembers.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getMembers.js`),
 },
 getMember: {
  reload: async () => {
   self.getMember.file = await import(
    `../../../../requestHandler/guilds/getMember.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getMember.js`),
 },
 searchForMembers: {
  reload: async () => {
   self.searchForMembers.file = await import(
    `../../../../requestHandler/guilds/searchForMembers.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/searchForMembers.js`),
 },
 editMember: {
  reload: async () => {
   self.editMember.file = await import(
    `../../../../requestHandler/guilds/editMember.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/editMember.js`),
 },
 removeMember: {
  reload: async () => {
   self.removeMember.file = await import(
    `../../../../requestHandler/guilds/removeMember.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/removeMember.js`),
 },
 addRoleToMember: {
  reload: async () => {
   self.addRoleToMember.file = await import(
    `../../../../requestHandler/guilds/addRoleToMember.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/addRoleToMember.js`),
 },
 removeRoleFromMember: {
  reload: async () => {
   self.removeRoleFromMember.file = await import(
    `../../../../requestHandler/guilds/removeRoleFromMember.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/removeRoleFromMember.js`),
 },
 getRoles: {
  reload: async () => {
   self.getRoles.file = await import(
    `../../../../requestHandler/guilds/getRoles.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getRoles.js`),
 },
 createRole: {
  reload: async () => {
   self.createRole.file = await import(
    `../../../../requestHandler/guilds/createRole.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/createRole.js`),
 },
 editRole: {
  reload: async () => {
   self.editRole.file = await import(
    `../../../../requestHandler/guilds/editRole.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/editRole.js`),
 },
 deleteRole: {
  reload: async () => {
   self.deleteRole.file = await import(
    `../../../../requestHandler/guilds/deleteRole.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/deleteRole.js`),
 },
 getPruneCount: {
  reload: async () => {
   self.getPruneCount.file = await import(
    `../../../../requestHandler/guilds/getPruneCount.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getPruneCount.js`),
 },
 deleteScheduledEvent: {
  reload: async () => {
   self.deleteScheduledEvent.file = await import(
    `../../../../requestHandler/guilds/deleteScheduledEvent.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/deleteScheduledEvent.js`),
 },
 editScheduledEvent: {
  reload: async () => {
   self.editScheduledEvent.file = await import(
    `../../../../requestHandler/guilds/editScheduledEvent.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/editScheduledEvent.js`),
 },
 createScheduledEvent: {
  reload: async () => {
   self.createScheduledEvent.file = await import(
    `../../../../requestHandler/guilds/createScheduledEvent.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/createScheduledEvent.js`),
 },
 getScheduledEvent: {
  reload: async () => {
   self.getScheduledEvent.file = await import(
    `../../../../requestHandler/guilds/getScheduledEvent.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getScheduledEvent.js`),
 },
 getScheduledEvents: {
  reload: async () => {
   self.getScheduledEvents.file = await import(
    `../../../../requestHandler/guilds/getScheduledEvents.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getScheduledEvents.js`),
 },
 getScheduledEventUsers: {
  reload: async () => {
   self.getScheduledEventUsers.file = await import(
    `../../../../requestHandler/guilds/getScheduledEventUsers.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getScheduledEventUsers.js`),
 },
 getStickers: {
  reload: async () => {
   self.getStickers.file = await import(
    `../../../../requestHandler/guilds/getStickers.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getStickers.js`),
 },
 getSticker: {
  reload: async () => {
   self.getSticker.file = await import(
    `../../../../requestHandler/guilds/getSticker.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getSticker.js`),
 },
 createSticker: {
  reload: async () => {
   self.createSticker.file = await import(
    `../../../../requestHandler/guilds/createSticker.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/createSticker.js`),
 },
 editSticker: {
  reload: async () => {
   self.editSticker.file = await import(
    `../../../../requestHandler/guilds/editSticker.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/editSticker.js`),
 },
 deleteSticker: {
  reload: async () => {
   self.deleteSticker.file = await import(
    `../../../../requestHandler/guilds/deleteSticker.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/deleteSticker.js`),
 },
 getTemplates: {
  reload: async () => {
   self.getTemplates.file = await import(
    `../../../../requestHandler/guilds/getTemplates.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getTemplates.js`),
 },
 getTemplate: {
  reload: async () => {
   self.getTemplate.file = await import(
    `../../../../requestHandler/guilds/getTemplate.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getTemplate.js`),
 },
 createTemplate: {
  reload: async () => {
   self.createTemplate.file = await import(
    `../../../../requestHandler/guilds/createTemplate.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/createTemplate.js`),
 },
 editTemplate: {
  reload: async () => {
   self.editTemplate.file = await import(
    `../../../../requestHandler/guilds/editTemplate.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/editTemplate.js`),
 },
 deleteTemplate: {
  reload: async () => {
   self.deleteTemplate.file = await import(
    `../../../../requestHandler/guilds/deleteTemplate.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/deleteTemplate.js`),
 },
 getWebhooks: {
  reload: async () => {
   self.getWebhooks.file = await import(
    `../../../../requestHandler/guilds/getWebhooks.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getWebhooks.js`),
 },
 getMemberBans: {
  reload: async () => {
   self.getMemberBans.file = await import(
    `../../../../requestHandler/guilds/getMemberBans.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getMemberBans.js`),
 },
 getOnboarding: {
  reload: async () => {
   self.getOnboarding.file = await import(
    `../../../../requestHandler/guilds/getOnboarding.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getOnboarding.js`),
 },
 setVoiceState: {
  reload: async () => {
   self.setVoiceState.file = await import(
    `../../../../requestHandler/guilds/setVoiceState.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/setVoiceState.js`),
 },
 syncTemplate: {
  reload: async () => {
   self.syncTemplate.file = await import(
    `../../../../requestHandler/guilds/syncTemplate.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/syncTemplate.js`),
 },
 editUserVoiceState: {
  reload: async () => {
   self.editUserVoiceState.file = await import(
    `../../../../requestHandler/guilds/editUserVoiceState.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/editUserVoiceState.js`),
 },
 editMFALevel: {
  reload: async () => {
   self.editMFALevel.file = await import(
    `../../../../requestHandler/guilds/editMFALevel.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/editMFALevel.js`),
 },
 getPreview: {
  reload: async () => {
   self.getPreview.file = await import(
    `../../../../requestHandler/guilds/getPreview.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getPreview.js`),
 },
 create: {
  reload: async () => {
   self.create.file = await import(
    `../../../../requestHandler/guilds/create.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/create.js`),
 },
 createChannel: {
  reload: async () => {
   self.createChannel.file = await import(
    `../../../../requestHandler/guilds/createChannel.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/createChannel.js`),
 },
 setChannelPositions: {
  reload: async () => {
   self.setChannelPositions.file = await import(
    `../../../../requestHandler/guilds/setChannelPositions.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/setChannelPositions.js`),
 },
 getActiveThreads: {
  reload: async () => {
   self.getActiveThreads.file = await import(
    `../../../../requestHandler/guilds/getActiveThreads.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getActiveThreads.js`),
 },
 getMemberBan: {
  reload: async () => {
   self.getMemberBan.file = await import(
    `../../../../requestHandler/guilds/getMemberBan.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/getMemberBan.js`),
 },
 banMember: {
  reload: async () => {
   self.banMember.file = await import(
    `../../../../requestHandler/guilds/banMember.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/banMember.js`),
 },
 banUser: {
  reload: async () => {
   self.banUser.file = await import(
    `../../../../requestHandler/guilds/banUser.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/banUser.js`),
 },
 unbanUser: {
  reload: async () => {
   self.unbanUser.file = await import(
    `../../../../requestHandler/guilds/unbanUser.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/unbanUser.js`),
 },
 setRolePositions: {
  reload: async () => {
   self.setRolePositions.file = await import(
    `../../../../requestHandler/guilds/setRolePositions.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/guilds/setRolePositions.js`),
 },
};

export default self;
