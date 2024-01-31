import cache from './UtilModules/cache.js';
import helpHelpers from './UtilModules/helpHelpers.js';
import mod from './UtilModules/mod.js';
import requestHandler from './UtilModules/requestHandler.js';
import settingsHelpers from './UtilModules/settingsHelpers.js';

const self = {
 cache,
 helpHelpers,
 mod,
 requestHandler,
 settingsHelpers,

 arrayBufferToBuffer: {
  reload: async () => {
   self.arrayBufferToBuffer.file = await import(
    `../../arrayBufferToBuffer.js?version=${Date.now()}`
   );
  },
  file: await import(`../../arrayBufferToBuffer.js`),
 },
 deleteNotificationThread: {
  reload: async () => {
   self.deleteNotificationThread.file = await import(
    `../../deleteNotificationThread.js?version=${Date.now()}`
   );
  },
  file: await import(`../../deleteNotificationThread.js`),
 },
 notificationThread: {
  reload: async () => {
   self.notificationThread.file = await import(`../../notificationThread.js?version=${Date.now()}`);
  },
  file: await import(`../../notificationThread.js`),
 },
 arrayEquals: {
  reload: async () => {
   self.arrayEquals.file = await import(`../../arrayEquals.js?version=${Date.now()}`);
  },
  file: await import(`../../arrayEquals.js`),
 },
 bitUniques: {
  reload: async () => {
   self.bitUniques.file = await import(`../../bitUniques.js?version=${Date.now()}`);
  },
  file: await import(`../../bitUniques.js`),
 },
 channelRuleCalc: {
  reload: async () => {
   self.channelRuleCalc.file = await import(`../../channelRuleCalc.js?version=${Date.now()}`);
  },
  file: await import(`../../channelRuleCalc.js`),
 },
 constants: {
  reload: async () => {
   self.constants.file = await import(`../../../Other/constants.js?version=${Date.now()}`);
  },
  file: await import(`../../../Other/constants.js`),
 },
 disableComponents: {
  reload: async () => {
   self.disableComponents.file = await import(`../../disableComponents.js?version=${Date.now()}`);
  },
  file: await import(`../../disableComponents.js`),
 },
 dynamicToEmbed: {
  reload: async () => {
   self.dynamicToEmbed.file = await import(`../../dynamicToEmbed.js?version=${Date.now()}`);
  },
  file: await import(`../../dynamicToEmbed.js`),
 },
 emotes: {
  reload: async () => {
   self.emotes.file = await import(`../../emotes.js?version=${Date.now()}`);
  },
  file: await import(`../../emotes.js`),
 },
 encodeString2BigInt: {
  reload: async () => {
   self.encodeString2BigInt.file = await import(
    `../../encodeString2BigInt.js?version=${Date.now()}`
   );
  },
  file: await import(`../../encodeString2BigInt.js`),
 },
 error: {
  reload: async () => {
   self.error.file = await import(`../../error.js?version=${Date.now()}`);
  },
  file: await import(`../../error.js`),
 },
 errorCmd: {
  reload: async () => {
   self.errorCmd.file = await import(`../../errorCmd.js?version=${Date.now()}`);
  },
  file: await import(`../../errorCmd.js`),
 },
 errorMsg: {
  reload: async () => {
   self.errorMsg.file = await import(`../../errorMsg.js?version=${Date.now()}`);
  },
  file: await import(`../../errorMsg.js`),
 },
 fetchAllEventSubscribers: {
  reload: async () => {
   self.fetchAllEventSubscribers.file = await import(
    `../../fetchAllEventSubscribers.js?version=${Date.now()}`
   );
  },
  file: await import(`../../fetchAllEventSubscribers.js`),
 },
 fetchAllGuildMembers: {
  reload: async () => {
   self.fetchAllGuildMembers.file = await import(
    `../../fetchAllGuildMembers.js?version=${Date.now()}`
   );
  },
  file: await import(`../../fetchAllGuildMembers.js`),
 },
 fetchMessages: {
  reload: async () => {
   self.fetchMessages.file = await import(`../../fetchMessages.js?version=${Date.now()}`);
  },
  file: await import(`../../fetchMessages.js`),
 },
 fetchWithRedirects: {
  reload: async () => {
   self.fetchWithRedirects.file = await import(`../../fetchWithRedirects.js?version=${Date.now()}`);
  },
  file: await import(`../../fetchWithRedirects.js`),
 },
 fileURL2Buffer: {
  reload: async () => {
   self.fileURL2Buffer.file = await import(`../../fileURL2Buffer.js?version=${Date.now()}`);
  },
  file: await import(`../../fileURL2Buffer.js`),
 },
 findServerByName: {
  reload: async () => {
   self.findServerByName.file = await import(`../../findServerByName.js?version=${Date.now()}`);
  },
  file: await import(`../../findServerByName.js`),
 },
 findUserByName: {
  reload: async () => {
   self.findUserByName.file = await import(`../../findUserByName.js?version=${Date.now()}`);
  },
  file: await import(`../../findUserByName.js`),
 },
 firstGuildInteraction: {
  reload: async () => {
   self.firstGuildInteraction.file = await import(
    `../../../Other/firstGuildInteraction.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../Other/firstGuildInteraction.js`),
 },
 firstChannelInteraction: {
  reload: async () => {
   self.firstChannelInteraction.file = await import(
    `../../../Other/firstChannelInteraction.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../Other/firstChannelInteraction.js`),
 },
 getAllBans: {
  reload: async () => {
   self.getAllBans.file = await import(`../../getAllBans.js?version=${Date.now()}`);
  },
  file: await import(`../../getAllBans.js`),
 },
 getAllInvites: {
  reload: async () => {
   self.getAllInvites.file = await import(`../../getAllInvites.js?version=${Date.now()}`);
  },
  file: await import(`../../getAllInvites.js`),
 },
 getAudit: {
  reload: async () => {
   self.getAudit.file = await import(`../../getAudit.js?version=${Date.now()}`);
  },
  file: await import(`../../getAudit.js`),
 },
 getBotIdFrom: {
  reload: async () => {
   self.getBotIdFrom.file = await import(`../../getBotIdFrom.js?version=${Date.now()}`);
  },
  file: await import(`../../getBotIdFrom.js`),
 },
 getBotMemberFromGuild: {
  reload: async () => {
   self.getBotMemberFromGuild.file = await import(
    `../../getBotMemberFromGuild.js?version=${Date.now()}`
   );
  },
  file: await import(`../../getBotMemberFromGuild.js`),
 },
 getChanged: {
  reload: async () => {
   self.getChanged.file = await import(`../../getChanged.js?version=${Date.now()}`);
  },
  file: await import(`../../getChanged.js`),
 },
 getChannel: {
  reload: async () => {
   self.getChannel.file = await import(`../../getChannel.js?version=${Date.now()}`);
  },
  file: await import(`../../getChannel.js`),
 },
 getChannelWebhook: {
  reload: async () => {
   self.getChannelWebhook.file = await import(`../../getChannelWebhook.js?version=${Date.now()}`);
  },
  file: await import(`../../getChannelWebhook.js`),
 },
 getChunks: {
  reload: async () => {
   self.getChunks.file = await import(`../../getChunks.js?version=${Date.now()}`);
  },
  file: await import(`../../getChunks.js`),
 },
 getColor: {
  reload: async () => {
   self.getColor.file = await import(`../../getColor.js?version=${Date.now()}`);
  },
  file: await import(`../../getColor.js`),
 },
 getCustomCommand: {
  reload: async () => {
   self.getCustomCommand.file = await import(`../../getCustomCommand.js?version=${Date.now()}`);
  },
  file: await import(`../../getCustomCommand.js`),
 },
 getDifference: {
  reload: async () => {
   self.getDifference.file = await import(`../../getDifference.js?version=${Date.now()}`);
  },
  file: await import(`../../getDifference.js`),
 },
 getDiscordEmbed: {
  reload: async () => {
   self.getDiscordEmbed.file = await import(`../../getDiscordEmbed.js?version=${Date.now()}`);
  },
  file: await import(`../../getDiscordEmbed.js`),
 },
 getDuration: {
  reload: async () => {
   self.getDuration.file = await import(`../../getDuration.js?version=${Date.now()}`);
  },
  file: await import(`../../getDuration.js`),
 },
 getEmote: {
  reload: async () => {
   self.getEmote.file = await import(`../../getEmote.js?version=${Date.now()}`);
  },
  file: await import(`../../getEmote.js`),
 },
 getEvents: {
  reload: async () => {
   self.getEvents.file = await import(`../../getEvents.js?version=${Date.now()}`);
  },
  file: await import(`../../getEvents.js`),
 },
 getGif: {
  reload: async () => {
   self.getGif.file = await import(`../../getGif.js?version=${Date.now()}`);
  },
  file: await import(`../../getGif.js`),
 },
 getLanguage: {
  reload: async () => {
   self.getLanguage.file = await import(`../../getLanguage.js?version=${Date.now()}`);
  },
  file: await import(`../../getLanguage.js`),
 },
 getLogChannels: {
  reload: async () => {
   self.getLogChannels.file = await import(`../../getLogChannels.js?version=${Date.now()}`);
  },
  file: await import(`../../getLogChannels.js`),
 },
 getMessage: {
  reload: async () => {
   self.getMessage.file = await import(`../../getMessage.js?version=${Date.now()}`);
  },
  file: await import(`../../getMessage.js`),
 },
 getNameAndFileType: {
  reload: async () => {
   self.getNameAndFileType.file = await import(`../../getNameAndFileType.js?version=${Date.now()}`);
  },
  file: await import(`../../getNameAndFileType.js`),
 },
 getPunishment: {
  reload: async () => {
   self.getPunishment.file = await import(`../../getPunishment.js?version=${Date.now()}`);
  },
  file: await import(`../../getPunishment.js`),
 },
 getRandom: {
  reload: async () => {
   self.getRandom.file = await import(`../../getRandom.js?version=${Date.now()}`);
  },
  file: await import(`../../getRandom.js`),
 },
 getReferenceMessage: {
  reload: async () => {
   self.getReferenceMessage.file = await import(
    `../../getReferenceMessage.js?version=${Date.now()}`
   );
  },
  file: await import(`../../getReferenceMessage.js`),
 },
 getSerializedChannelPerms: {
  reload: async () => {
   self.getSerializedChannelPerms.file = await import(
    `../../getSerializedChannelPerms.js?version=${Date.now()}`
   );
  },
  file: await import(`../../getSerializedChannelPerms.js`),
 },
 getStringChunks: {
  reload: async () => {
   self.getStringChunks.file = await import(`../../getStringChunks.js?version=${Date.now()}`);
  },
  file: await import(`../../getStringChunks.js`),
 },
 getTarget: {
  reload: async () => {
   self.getTarget.file = await import(`../../getTarget.js?version=${Date.now()}`);
  },
  file: await import(`../../getTarget.js`),
 },
 getTargetChannel: {
  reload: async () => {
   self.getTargetChannel.file = await import(`../../getTargetChannel.js?version=${Date.now()}`);
  },
  file: await import(`../../getTargetChannel.js`),
 },
 getTrueChannelType: {
  reload: async () => {
   self.getTrueChannelType.file = await import(`../../getTrueChannelType.js?version=${Date.now()}`);
  },
  file: await import(`../../getTrueChannelType.js`),
 },
 getUnix: {
  reload: async () => {
   self.getUnix.file = await import(`../../getUnix.js?version=${Date.now()}`);
  },
  file: await import(`../../getUnix.js`),
 },
 getUser: {
  reload: async () => {
   self.getUser.file = await import(`../../getUser.js?version=${Date.now()}`);
  },
  file: await import(`../../getUser.js`),
 },
 getUserFromUserAndUsernameOptions: {
  reload: async () => {
   self.getUserFromUserAndUsernameOptions.file = await import(
    `../../getUserFromUserAndUsernameOptions.js?version=${Date.now()}`
   );
  },
  file: await import(`../../getUserFromUserAndUsernameOptions.js`),
 },
 interactionHelpers: {
  reload: async () => {
   self.interactionHelpers.file = await import(`../../interactionHelpers.js?version=${Date.now()}`);
  },
  file: await import(`../../interactionHelpers.js`),
 },
 isDeleteable: {
  reload: async () => {
   self.isDeleteable.file = await import(`../../isDeleteable.js?version=${Date.now()}`);
  },
  file: await import(`../../isDeleteable.js`),
 },
 isEditable: {
  reload: async () => {
   self.isEditable.file = await import(`../../isEditable.js?version=${Date.now()}`);
  },
  file: await import(`../../isEditable.js`),
 },
 loadingEmbed: {
  reload: async () => {
   self.loadingEmbed.file = await import(`../../loadingEmbed.js?version=${Date.now()}`);
  },
  file: await import(`../../loadingEmbed.js`),
 },
 log: {
  reload: async () => {
   self.log.file = await import(`../../log.js?version=${Date.now()}`);
  },
  file: await import(`../../log.js`),
 },
 makeStp: {
  reload: async () => {
   self.makeStp.file = await import(`../../makeStp.js?version=${Date.now()}`);
  },
  file: await import(`../../makeStp.js`),
 },
 memberBoostCalc: {
  reload: async () => {
   self.memberBoostCalc.file = await import(`../../memberBoostCalc.js?version=${Date.now()}`);
  },
  file: await import(`../../memberBoostCalc.js`),
 },
 mergeLogging: {
  reload: async () => {
   self.mergeLogging.file = await import(`../../mergeLogging.js?version=${Date.now()}`);
  },
  file: await import(`../../mergeLogging.js`),
 },
 moment: {
  reload: async () => {
   self.moment.file = await import(`../../moment.js?version=${Date.now()}`);
  },
  file: await import(`../../moment.js`),
 },
 notYours: {
  reload: async () => {
   self.notYours.file = await import(`../../notYours.js?version=${Date.now()}`);
  },
  file: await import(`../../notYours.js`),
 },
 permCalc: {
  reload: async () => {
   self.permCalc.file = await import(`../../permCalc.js?version=${Date.now()}`);
  },
  file: await import(`../../permCalc.js`),
 },
 permError: {
  reload: async () => {
   self.permError.file = await import(`../../permError.js?version=${Date.now()}`);
  },
  file: await import(`../../permError.js`),
 },
 refreshToken: {
  reload: async () => {
   self.refreshToken.file = await import(`../../refreshToken.js?version=${Date.now()}`);
  },
  file: await import(`../../refreshToken.js`),
 },
 regexes: {
  reload: async () => {
   self.regexes.file = await import(`../../regexes.js?version=${Date.now()}`);
  },
  file: await import(`../../regexes.js`),
 },
 replyCmd: {
  reload: async () => {
   self.replyCmd.file = await import(`../../replyCmd.js?version=${Date.now()}`);
  },
  file: await import(`../../replyCmd.js`),
 },
 replyMsg: {
  reload: async () => {
   self.replyMsg.file = await import(`../../replyMsg.js?version=${Date.now()}`);
  },
  file: await import(`../../replyMsg.js`),
 },
 roleManager: {
  reload: async () => {
   self.roleManager.file = await import(`../../roleManager.js?version=${Date.now()}`);
  },
  file: await import(`../../roleManager.js`),
 },
 send: {
  reload: async () => {
   self.send.file = await import(`../../send.js?version=${Date.now()}`);
  },
  file: await import(`../../send.js`),
 },
 sleep: {
  reload: async () => {
   self.sleep.file = await import(`../../sleep.js?version=${Date.now()}`);
  },
  file: await import(`../../sleep.js`),
 },
 spaces: {
  reload: async () => {
   self.spaces.file = await import(`../../spaces.js?version=${Date.now()}`);
  },
  file: await import(`../../spaces.js`),
 },
 splitByThousand: {
  reload: async () => {
   self.splitByThousand.file = await import(`../../splitByThousands.js?version=${Date.now()}`);
  },
  file: await import(`../../splitByThousands.js`),
 },
 stp: {
  reload: async () => {
   self.stp.file = await import(`../../stp.js?version=${Date.now()}`);
  },
  file: await import(`../../stp.js`),
 },
 txtFileLinkToString: {
  reload: async () => {
   self.txtFileLinkToString.file = await import(
    `../../txtFileLinkToString.js?version=${Date.now()}`
   );
  },
  file: await import(`../../txtFileLinkToString.js`),
 },
 txtFileWriter: {
  reload: async () => {
   self.txtFileWriter.file = await import(`../../txtFileWriter.js?version=${Date.now()}`);
  },
  file: await import(`../../txtFileWriter.js`),
 },
 userFlagsCalc: {
  reload: async () => {
   self.userFlagsCalc.file = await import(`../../userFlagsCalc.js?version=${Date.now()}`);
  },
  file: await import(`../../userFlagsCalc.js`),
 },
 util: {
  reload: async () => {
   self.util.file = await import(`../../util.js?version=${Date.now()}`);
  },
  file: await import(`../../util.js`),
 },
 files: {
  reload: async () => {
   self.files.file = await import(`../../files.js?version=${Date.now()}`);
  },
  file: await import(`../../files.js`),
 },
};

export default self;
