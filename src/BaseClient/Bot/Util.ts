/* eslint-disable max-len */
import * as fs from 'fs';
import { API } from './Client.js';
import DataBase from './DataBase.js';

import arrayBufferToBuffer from '../UtilModules/arrayBufferToBuffer.js';
import cache from '../UtilModules/cache.js';
import encodeString2BigInt from '../UtilModules/encodeString2BigInt.js';
import getNameAndFileType from '../UtilModules/getNameAndFileType.js';
import importCache from '../UtilModules/importCache.js';
import stp from '../UtilModules/stp.js';

const utilModules = importCache.BaseClient.UtilModules;

const logFiles = {
 ratelimits: fs.createWriteStream(
  `${process.cwd()}/logs/ratelimits-${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}.log`,
  { flags: 'a' },
 ),
 console: fs.createWriteStream(
  `${process.cwd()}/logs/console_${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}.log`,
  { flags: 'a' },
 ),
};

interface Util {
 logFiles: typeof logFiles;
 DataBase: typeof DataBase;
 cache: typeof cache;
 importCache: typeof importCache.BaseClient.UtilModules.importCache.file.default;

 CT: typeof importCache.Typings.Settings.file & typeof importCache.Typings.Typings.file;
 files: typeof utilModules.files.file.default;
 deleteNotificationThread: typeof utilModules.deleteNotificationThread.file.default;
 notificationThread: typeof utilModules.notificationThread.file.default;
 arrayBufferToBuffer: typeof arrayBufferToBuffer;
 arrayEquals: typeof utilModules.arrayEquals.file.default;
 bitUniques: typeof utilModules.bitUniques.file.default;
 channelRuleCalc: typeof utilModules.channelRuleCalc.file.default;
 constants: typeof utilModules.constants.file.default;
 disableComponents: typeof utilModules.disableComponents.file.default;
 dynamicToEmbed: typeof utilModules.dynamicToEmbed.file.default;
 emotes: typeof utilModules.emotes.file.default;
 encodeString2BigInt: typeof encodeString2BigInt;
 error: typeof utilModules.error.file.default;
 errorCmd: typeof utilModules.errorCmd.file.default;
 errorMsg: typeof utilModules.errorMsg.file.default;
 fetchAllEventSubscribers: typeof utilModules.fetchAllEventSubscribers.file.default;
 fetchAllGuildMembers: typeof utilModules.fetchAllGuildMembers.file.default;
 fetchMessages: typeof utilModules.fetchMessages.file.default;
 fetchWithRedirects: typeof utilModules.fetchWithRedirects.file.default;
 fileURL2Buffer: typeof utilModules.fileURL2Buffer.file.default;
 findServerByName: typeof utilModules.findServerByName.file.default;
 findUserByName: typeof utilModules.findUserByName.file.default;
 firstGuildInteraction: typeof utilModules.firstGuildInteraction.file.default;
 firstChannelInteraction: typeof utilModules.firstChannelInteraction.file.default;
 getAllBans: typeof utilModules.getAllBans.file.default;
 getAllInvites: typeof utilModules.getAllInvites.file.default;
 getAudit: typeof utilModules.getAudit.file.default;
 getBotIdFromGuild: typeof utilModules.getBotIdFrom.file.guild;
 getBotIdFromToken: typeof utilModules.getBotIdFrom.file.token;
 getBotMemberFromGuild: typeof utilModules.getBotMemberFromGuild.file.default;
 getChanged: typeof utilModules.getChanged.file.default;
 getChannel: typeof utilModules.getChannel.file;
 getChannelWebhook: typeof utilModules.getChannelWebhook.file.default;
 getChunks: typeof utilModules.getChunks.file.default;
 getColor: typeof utilModules.getColor.file.default;
 getCustomCommand: typeof utilModules.getCustomCommand.file.default;
 getDifference: typeof utilModules.getDifference.file.default;
 getDiscordEmbed: typeof utilModules.getDiscordEmbed.file.default;
 getDuration: typeof utilModules.getDuration.file.default;
 getEmote: typeof utilModules.getEmote.file.default;
 getEvents: typeof utilModules.getEvents.file.default;
 getGif: typeof utilModules.getGif.file.default;
 getLanguage: typeof utilModules.getLanguage.file.default;
 getLogChannels: typeof utilModules.getLogChannels.file.default;
 getMessage: typeof utilModules.getMessage.file.default;
 getNameAndFileType: typeof getNameAndFileType;
 getPunishment: typeof utilModules.getPunishment.file.default;
 getRandom: typeof utilModules.getRandom.file.default;
 getReferenceMessage: typeof utilModules.getReferenceMessage.file.default;
 getSerializedChannelPerms: typeof utilModules.getSerializedChannelPerms.file.default;
 getStringChunks: typeof utilModules.getStringChunks.file.default;
 getTarget: typeof utilModules.getTarget.file.default;
 getTargetChannel: typeof utilModules.getTargetChannel.file.default;
 getTrueChannelType: typeof utilModules.getTrueChannelType.file.default;
 getUnix: typeof utilModules.getUnix.file.default;
 getUser: typeof utilModules.getUser.file.default;
 getUserFromUserAndUsernameOptions: typeof utilModules.getUserFromUserAndUsernameOptions.file.default;
 helpHelpers: {
  getDesc: typeof utilModules.helpHelpers.getDesc.file.default;
  getDescription: typeof utilModules.helpHelpers.getDescription.file.default;
  getEmbeds: typeof utilModules.helpHelpers.getEmbeds.file.default;
 };
 interactionHelpers: typeof utilModules.interactionHelpers.file.default;
 isDeleteable: typeof utilModules.isDeleteable.file.default;
 isEditable: typeof utilModules.isEditable.file.default;
 loadingEmbed: typeof utilModules.loadingEmbed.file.default;
 log: typeof utilModules.log.file.default;
 makeStp: typeof utilModules.makeStp.file.default;
 memberBoostCalc: typeof utilModules.memberBoostCalc.file.default;
 mergeLogging: typeof utilModules.mergeLogging.file.default;
 mod: {
  file: typeof utilModules.mod.file.default;

  mod: {
   banAdd: typeof utilModules.mod.mod.banAdd.file.default;
   banRemove: typeof utilModules.mod.mod.banRemove.file.default;
   channelBanAdd: typeof utilModules.mod.mod.channelBanAdd.file.default;
   channelBanRemove: typeof utilModules.mod.mod.channelBanRemove.file.default;
   kickAdd: typeof utilModules.mod.mod.kickAdd.file.default;
   muteRemove: typeof utilModules.mod.mod.muteRemove.file.default;
   roleAdd: typeof utilModules.mod.mod.roleAdd.file.default;
   roleRemove: typeof utilModules.mod.mod.roleRemove.file.default;
   softBanAdd: typeof utilModules.mod.mod.softBanAdd.file.default;
   softWarnAdd: typeof utilModules.mod.mod.softWarnAdd.file.default;
   strikeAdd: typeof utilModules.mod.mod.strikeAdd.file.default;
   tempBanAdd: typeof utilModules.mod.mod.tempBanAdd.file.default;
   tempChannelBanAdd: typeof utilModules.mod.mod.tempChannelBanAdd.file.default;
   tempMuteAdd: typeof utilModules.mod.mod.tempMuteAdd.file.default;
   unAfk: typeof utilModules.mod.mod.unAfk.file.default;
   warnAdd: typeof utilModules.mod.mod.warnAdd.file.default;
  };
  actionAlreadyApplied: typeof utilModules.mod.actionAlreadyApplied.file.default;
  alreadyExecuting: typeof utilModules.mod.alreadyExecuting.file.default;
  checkExeCanManage: typeof utilModules.mod.checkExeCanManage.file.default;
  err: typeof utilModules.mod.err.file.default;
  getMembers: typeof utilModules.mod.getMembers.file.default;
  getStrike: typeof utilModules.mod.getStrike.file.default;
  isMe: typeof utilModules.mod.isMe.file.default;
  isSelf: typeof utilModules.mod.isSelf.file.default;
  notifyTarget: typeof utilModules.mod.notifyTarget.file.default;
  permissionError: typeof utilModules.mod.permissionError.file.default;
  startLoading: typeof utilModules.mod.startLoading.file.default;
  db: typeof utilModules.mod.db.file.default;
  declareSuccess: typeof utilModules.mod.declareSuccess.file.default;
 };
 moment: typeof utilModules.moment.file.default;
 notYours: typeof utilModules.notYours.file.default;
 permCalc: typeof utilModules.permCalc.file.default;
 permError: typeof utilModules.permError.file.default;
 refreshToken: typeof utilModules.refreshToken.file.default;
 regexes: typeof utilModules.regexes.file.default;
 replyCmd: typeof utilModules.replyCmd.file.default;
 replyMsg: typeof utilModules.replyMsg.file.default;
 request: {
  commands: typeof utilModules.requestHandler.commands.file.default;
  channels: typeof utilModules.requestHandler.channels.file.default;
  guilds: typeof utilModules.requestHandler.guilds.file.default;
  webhooks: typeof utilModules.requestHandler.webhooks.file.default;
  invites: typeof utilModules.requestHandler.invites.file.default;
  oAuth2: typeof API.oauth2;
  roleConnections: typeof API.roleConnections;
  stageInstances: typeof utilModules.requestHandler.stageInstances.file.default;
  stickers: typeof utilModules.requestHandler.stickers.file.default;
  threads: typeof utilModules.requestHandler.threads.file.default;
  users: typeof utilModules.requestHandler.users.file.default;
  voice: typeof utilModules.requestHandler.voice.file.default;
 };
 requestHandler: typeof utilModules.requestHandler.file.default;
 requestHandlerError: typeof utilModules.requestHandlerError.file.default;
 roleManager: typeof utilModules.roleManager.file.default;
 send: typeof utilModules.send.file.default;
 settingsHelpers: {
  buttonParsers: {
   back: typeof utilModules.settingsHelpers.buttonParsers.back.file.default;
   delete: typeof utilModules.settingsHelpers.buttonParsers.delete.file.default;
   global: typeof utilModules.settingsHelpers.buttonParsers.global.file.default;
   next: typeof utilModules.settingsHelpers.buttonParsers.next.file.default;
   previous: typeof utilModules.settingsHelpers.buttonParsers.previous.file.default;
   setting: typeof utilModules.settingsHelpers.buttonParsers.setting.file.default;
   specific: typeof utilModules.settingsHelpers.buttonParsers.specific.file.default;
   boolean: typeof utilModules.settingsHelpers.buttonParsers.boolean.file.default;
  };
  changeHelpers: {
   back: typeof utilModules.settingsHelpers.changeHelpers.back.file.default;
   changeEmbed: typeof utilModules.settingsHelpers.changeHelpers.changeEmbed.file.default;
   changeModal: typeof utilModules.settingsHelpers.changeHelpers.changeModal.file.default;
   changeSelect: typeof utilModules.settingsHelpers.changeHelpers.changeSelect.file.default;
   changeSelectGlobal: typeof utilModules.settingsHelpers.changeHelpers.changeSelectGlobal.file.default;
   done: typeof utilModules.settingsHelpers.changeHelpers.done.file.default;
   get: typeof utilModules.settingsHelpers.changeHelpers.get.file.default;
   getAndInsert: typeof utilModules.settingsHelpers.changeHelpers.getAndInsert.file.default;
   makeEmpty: typeof utilModules.settingsHelpers.changeHelpers.makeEmpty.file.default;
   modal: typeof utilModules.settingsHelpers.changeHelpers.modal.file.default;
  };
  embedParsers: {
   author: typeof utilModules.settingsHelpers.embedParsers.author.file.default;
   boolean: typeof utilModules.settingsHelpers.embedParsers.boolean.file.default;
   channel: typeof utilModules.settingsHelpers.embedParsers.channel.file.default;
   channels: typeof utilModules.settingsHelpers.embedParsers.channels.file.default;
   command: typeof utilModules.settingsHelpers.embedParsers.command.file.default;
   embed: typeof utilModules.settingsHelpers.embedParsers.embed.file.default;
   emote: typeof utilModules.settingsHelpers.embedParsers.emote.file.default;
   number: typeof utilModules.settingsHelpers.embedParsers.number.file.default;
   role: typeof utilModules.settingsHelpers.embedParsers.role.file.default;
   roles: typeof utilModules.settingsHelpers.embedParsers.roles.file.default;
   rules: typeof utilModules.settingsHelpers.embedParsers.rules.file.default;
   string: typeof utilModules.settingsHelpers.embedParsers.string.file.default;
   time: typeof utilModules.settingsHelpers.embedParsers.time.file.default;
   user: typeof utilModules.settingsHelpers.embedParsers.user.file.default;
   users: typeof utilModules.settingsHelpers.embedParsers.users.file.default;
  };
  multiRowHelpers: {
   components: typeof utilModules.settingsHelpers.multiRowHelpers.components.file.default;
   options: typeof utilModules.settingsHelpers.multiRowHelpers.options.file.default;
   embeds: typeof utilModules.settingsHelpers.multiRowHelpers.embeds.file.default;
   noFields: typeof utilModules.settingsHelpers.multiRowHelpers.noFields.file.default;
  };
  del: typeof utilModules.settingsHelpers.del.file.default;
  getChangeSelectType: typeof utilModules.settingsHelpers.getChangeSelectType.file.default;
  getEmoji: typeof utilModules.settingsHelpers.getEmoji.file.default;
  getGlobalDesc: typeof utilModules.settingsHelpers.getGlobalDesc.file.default;
  getLable: typeof utilModules.settingsHelpers.getLable.file.default;
  getMention: typeof utilModules.settingsHelpers.getMention.file.default;
  getPlaceholder: typeof utilModules.settingsHelpers.getPlaceholder.file.default;
  getSettingsFile: typeof utilModules.settingsHelpers.getSettingsFile.file.default;
  getStyle: typeof utilModules.settingsHelpers.getStyle.file.default;
  postUpdate: typeof utilModules.settingsHelpers.postUpdate.file.default;
  setup: typeof utilModules.settingsHelpers.setup.file.default;
  updateLog: typeof utilModules.settingsHelpers.updateLog.file.default;
 };
 sleep: typeof utilModules.sleep.file.default;
 spaces: typeof utilModules.spaces.file.default;
 splitByThousand: typeof utilModules.splitByThousand.file.default;
 stp: typeof stp;
 txtFileLinkToString: typeof utilModules.txtFileLinkToString.file.default;
 txtFileWriter: typeof utilModules.txtFileWriter.file.default;
 userFlagsCalc: typeof utilModules.userFlagsCalc.file.default;
 logError: typeof utilModules.logError.file.default;
 util: typeof utilModules.util.file;
}

const util: Util = {
 logFiles,
 DataBase,
 cache,

 CT: { ...importCache.Typings.Settings.file, ...importCache.Typings.Typings.file },
 importCache: importCache.BaseClient.UtilModules.importCache.file.default,
 files: utilModules.files.file.default,
 deleteNotificationThread: utilModules.deleteNotificationThread.file.default,
 notificationThread: utilModules.notificationThread.file.default,
 arrayBufferToBuffer,
 arrayEquals: utilModules.arrayEquals.file.default,
 bitUniques: utilModules.bitUniques.file.default,
 channelRuleCalc: utilModules.channelRuleCalc.file.default,
 constants: utilModules.constants.file.default,
 disableComponents: utilModules.disableComponents.file.default,
 dynamicToEmbed: utilModules.dynamicToEmbed.file.default,
 emotes: utilModules.emotes.file.default,
 encodeString2BigInt,
 error: utilModules.error.file.default,
 errorCmd: utilModules.errorCmd.file.default,
 errorMsg: utilModules.errorMsg.file.default,
 fetchAllEventSubscribers: utilModules.fetchAllEventSubscribers.file.default,
 fetchAllGuildMembers: utilModules.fetchAllGuildMembers.file.default,
 fetchMessages: utilModules.fetchMessages.file.default,
 fetchWithRedirects: utilModules.fetchWithRedirects.file.default,
 fileURL2Buffer: utilModules.fileURL2Buffer.file.default,
 findServerByName: utilModules.findServerByName.file.default,
 findUserByName: utilModules.findUserByName.file.default,
 firstGuildInteraction: utilModules.firstGuildInteraction.file.default,
 firstChannelInteraction: utilModules.firstChannelInteraction.file.default,
 getAllBans: utilModules.getAllBans.file.default,
 getAllInvites: utilModules.getAllInvites.file.default,
 getAudit: utilModules.getAudit.file.default,
 getBotIdFromGuild: utilModules.getBotIdFrom.file.guild,
 getBotIdFromToken: utilModules.getBotIdFrom.file.token,
 getBotMemberFromGuild: utilModules.getBotMemberFromGuild.file.default,
 getChanged: utilModules.getChanged.file.default,
 getChannel: utilModules.getChannel.file,
 getChannelWebhook: utilModules.getChannelWebhook.file.default,
 getChunks: utilModules.getChunks.file.default,
 getColor: utilModules.getColor.file.default,
 getCustomCommand: utilModules.getCustomCommand.file.default,
 getDifference: utilModules.getDifference.file.default,
 getDiscordEmbed: utilModules.getDiscordEmbed.file.default,
 getDuration: utilModules.getDuration.file.default,
 getEmote: utilModules.getEmote.file.default,
 getEvents: utilModules.getEvents.file.default,
 getGif: utilModules.getGif.file.default,
 getLanguage: utilModules.getLanguage.file.default,
 getLogChannels: utilModules.getLogChannels.file.default,
 getMessage: utilModules.getMessage.file.default,
 getNameAndFileType,
 getPunishment: utilModules.getPunishment.file.default,
 getRandom: utilModules.getRandom.file.default,
 getReferenceMessage: utilModules.getReferenceMessage.file.default,
 getSerializedChannelPerms: utilModules.getSerializedChannelPerms.file.default,
 getStringChunks: utilModules.getStringChunks.file.default,
 getTarget: utilModules.getTarget.file.default,
 getTargetChannel: utilModules.getTargetChannel.file.default,
 getTrueChannelType: utilModules.getTrueChannelType.file.default,
 getUnix: utilModules.getUnix.file.default,
 getUser: utilModules.getUser.file.default,
 getUserFromUserAndUsernameOptions: utilModules.getUserFromUserAndUsernameOptions.file.default,
 helpHelpers: {
  getDesc: utilModules.helpHelpers.getDesc.file.default,
  getDescription: utilModules.helpHelpers.getDescription.file.default,
  getEmbeds: utilModules.helpHelpers.getEmbeds.file.default,
 },
 interactionHelpers: utilModules.interactionHelpers.file.default,
 isDeleteable: utilModules.isDeleteable.file.default,
 isEditable: utilModules.isEditable.file.default,
 loadingEmbed: utilModules.loadingEmbed.file.default,
 log: utilModules.log.file.default,
 makeStp: utilModules.makeStp.file.default,
 memberBoostCalc: utilModules.memberBoostCalc.file.default,
 mergeLogging: utilModules.mergeLogging.file.default,
 mod: {
  file: utilModules.mod.file.default,

  mod: {
   banAdd: utilModules.mod.mod.banAdd.file.default,
   banRemove: utilModules.mod.mod.banRemove.file.default,
   channelBanAdd: utilModules.mod.mod.channelBanAdd.file.default,
   channelBanRemove: utilModules.mod.mod.channelBanRemove.file.default,
   kickAdd: utilModules.mod.mod.kickAdd.file.default,
   muteRemove: utilModules.mod.mod.muteRemove.file.default,
   roleAdd: utilModules.mod.mod.roleAdd.file.default,
   roleRemove: utilModules.mod.mod.roleRemove.file.default,
   softBanAdd: utilModules.mod.mod.softBanAdd.file.default,
   softWarnAdd: utilModules.mod.mod.softWarnAdd.file.default,
   strikeAdd: utilModules.mod.mod.strikeAdd.file.default,
   tempBanAdd: utilModules.mod.mod.tempBanAdd.file.default,
   tempChannelBanAdd: utilModules.mod.mod.tempChannelBanAdd.file.default,
   tempMuteAdd: utilModules.mod.mod.tempMuteAdd.file.default,
   unAfk: utilModules.mod.mod.unAfk.file.default,
   warnAdd: utilModules.mod.mod.warnAdd.file.default,
  },
  actionAlreadyApplied: utilModules.mod.actionAlreadyApplied.file.default,
  alreadyExecuting: utilModules.mod.alreadyExecuting.file.default,
  checkExeCanManage: utilModules.mod.checkExeCanManage.file.default,
  err: utilModules.mod.err.file.default,
  getMembers: utilModules.mod.getMembers.file.default,
  getStrike: utilModules.mod.getStrike.file.default,
  isMe: utilModules.mod.isMe.file.default,
  isSelf: utilModules.mod.isSelf.file.default,
  notifyTarget: utilModules.mod.notifyTarget.file.default,
  permissionError: utilModules.mod.permissionError.file.default,
  startLoading: utilModules.mod.startLoading.file.default,
  db: utilModules.mod.db.file.default,
  declareSuccess: utilModules.mod.declareSuccess.file.default,
 },
 moment: utilModules.moment.file.default,
 notYours: utilModules.notYours.file.default,
 permCalc: utilModules.permCalc.file.default,
 permError: utilModules.permError.file.default,
 refreshToken: utilModules.refreshToken.file.default,
 regexes: utilModules.regexes.file.default,
 replyCmd: utilModules.replyCmd.file.default,
 replyMsg: utilModules.replyMsg.file.default,
 request: {
  commands: utilModules.requestHandler.commands.file.default,
  channels: utilModules.requestHandler.channels.file.default,
  guilds: utilModules.requestHandler.guilds.file.default,
  webhooks: utilModules.requestHandler.webhooks.file.default,
  invites: utilModules.requestHandler.invites.file.default,
  oAuth2: API.oauth2,
  roleConnections: API.roleConnections,
  stageInstances: utilModules.requestHandler.stageInstances.file.default,
  stickers: utilModules.requestHandler.stickers.file.default,
  threads: utilModules.requestHandler.threads.file.default,
  users: utilModules.requestHandler.users.file.default,
  voice: utilModules.requestHandler.voice.file.default,
 },
 requestHandler: utilModules.requestHandler.file.default,
 requestHandlerError: utilModules.requestHandlerError.file.default,
 roleManager: utilModules.roleManager.file.default,
 send: utilModules.send.file.default,
 settingsHelpers: {
  buttonParsers: {
   back: utilModules.settingsHelpers.buttonParsers.back.file.default,
   delete: utilModules.settingsHelpers.buttonParsers.delete.file.default,
   global: utilModules.settingsHelpers.buttonParsers.global.file.default,
   next: utilModules.settingsHelpers.buttonParsers.next.file.default,
   previous: utilModules.settingsHelpers.buttonParsers.previous.file.default,
   setting: utilModules.settingsHelpers.buttonParsers.setting.file.default,
   specific: utilModules.settingsHelpers.buttonParsers.specific.file.default,
   boolean: utilModules.settingsHelpers.buttonParsers.boolean.file.default,
  },
  changeHelpers: {
   back: utilModules.settingsHelpers.changeHelpers.back.file.default,
   changeEmbed: utilModules.settingsHelpers.changeHelpers.changeEmbed.file.default,
   changeModal: utilModules.settingsHelpers.changeHelpers.changeModal.file.default,
   changeSelect: utilModules.settingsHelpers.changeHelpers.changeSelect.file.default,
   changeSelectGlobal: utilModules.settingsHelpers.changeHelpers.changeSelectGlobal.file.default,
   done: utilModules.settingsHelpers.changeHelpers.done.file.default,
   get: utilModules.settingsHelpers.changeHelpers.get.file.default,
   getAndInsert: utilModules.settingsHelpers.changeHelpers.getAndInsert.file.default,
   makeEmpty: utilModules.settingsHelpers.changeHelpers.makeEmpty.file.default,
   modal: utilModules.settingsHelpers.changeHelpers.modal.file.default,
  },
  embedParsers: {
   author: utilModules.settingsHelpers.embedParsers.author.file.default,
   boolean: utilModules.settingsHelpers.embedParsers.boolean.file.default,
   channel: utilModules.settingsHelpers.embedParsers.channel.file.default,
   channels: utilModules.settingsHelpers.embedParsers.channels.file.default,
   command: utilModules.settingsHelpers.embedParsers.command.file.default,
   embed: utilModules.settingsHelpers.embedParsers.embed.file.default,
   emote: utilModules.settingsHelpers.embedParsers.emote.file.default,
   number: utilModules.settingsHelpers.embedParsers.number.file.default,
   role: utilModules.settingsHelpers.embedParsers.role.file.default,
   roles: utilModules.settingsHelpers.embedParsers.roles.file.default,
   rules: utilModules.settingsHelpers.embedParsers.rules.file.default,
   string: utilModules.settingsHelpers.embedParsers.string.file.default,
   time: utilModules.settingsHelpers.embedParsers.time.file.default,
   user: utilModules.settingsHelpers.embedParsers.user.file.default,
   users: utilModules.settingsHelpers.embedParsers.users.file.default,
  },
  multiRowHelpers: {
   components: utilModules.settingsHelpers.multiRowHelpers.components.file.default,
   options: utilModules.settingsHelpers.multiRowHelpers.options.file.default,
   embeds: utilModules.settingsHelpers.multiRowHelpers.embeds.file.default,
   noFields: utilModules.settingsHelpers.multiRowHelpers.noFields.file.default,
  },
  del: utilModules.settingsHelpers.del.file.default,
  getChangeSelectType: utilModules.settingsHelpers.getChangeSelectType.file.default,
  getEmoji: utilModules.settingsHelpers.getEmoji.file.default,
  getGlobalDesc: utilModules.settingsHelpers.getGlobalDesc.file.default,
  getLable: utilModules.settingsHelpers.getLable.file.default,
  getMention: utilModules.settingsHelpers.getMention.file.default,
  getPlaceholder: utilModules.settingsHelpers.getPlaceholder.file.default,
  getSettingsFile: utilModules.settingsHelpers.getSettingsFile.file.default,
  getStyle: utilModules.settingsHelpers.getStyle.file.default,
  postUpdate: utilModules.settingsHelpers.postUpdate.file.default,
  setup: utilModules.settingsHelpers.setup.file.default,
  updateLog: utilModules.settingsHelpers.updateLog.file.default,
 },
 sleep: utilModules.sleep.file.default,
 spaces: utilModules.spaces.file.default,
 splitByThousand: utilModules.splitByThousand.file.default,
 stp,
 txtFileLinkToString: utilModules.txtFileLinkToString.file.default,
 txtFileWriter: utilModules.txtFileWriter.file.default,
 userFlagsCalc: utilModules.userFlagsCalc.file.default,
 logError: utilModules.logError.file.default,
 util: utilModules.util.file,
};

export default util;
