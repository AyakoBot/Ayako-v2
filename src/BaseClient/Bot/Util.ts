import * as fs from 'fs';

import { Colors } from '../../Typings/Typings.js';
import constants from '../Other/constants.js';
import firstChannelInteraction from '../Other/firstChannelInteraction.js';
import firstGuildInteraction from '../Other/firstGuildInteraction.js';

import arrayBufferToBuffer from '../UtilModules/arrayBufferToBuffer.js';
import arrayEquals from '../UtilModules/arrayEquals.js';
import bitUniques from '../UtilModules/bitUniques.js';
import cache from '../UtilModules/cache.js';
import channelRuleCalc from '../UtilModules/channelRuleCalc.js';
import deleteNotificationThread from '../UtilModules/deleteNotificationThread.js';
import disableComponents from '../UtilModules/disableComponents.js';
import dynamicToEmbed from '../UtilModules/dynamicToEmbed.js';
import emotes from '../UtilModules/emotes.js';
import encodeString2BigInt from '../UtilModules/encodeString2BigInt.js';
import error from '../UtilModules/error.js';
import errorCmd from '../UtilModules/errorCmd.js';
import errorMsg from '../UtilModules/errorMsg.js';
import fetchAllEventSubscribers from '../UtilModules/fetchAllEventSubscribers.js';
import fetchAllGuildMembers from '../UtilModules/fetchAllGuildMembers.js';
import fetchMessages from '../UtilModules/fetchMessages.js';
import fetchWithRedirects from '../UtilModules/fetchWithRedirects.js';
import fileURL2Buffer from '../UtilModules/fileURL2Buffer.js';
import files from '../UtilModules/files.js';
import findServerByName from '../UtilModules/findServerByName.js';
import findUserByName from '../UtilModules/findUserByName.js';
import getAllBans from '../UtilModules/getAllBans.js';
import getAllInvites from '../UtilModules/getAllInvites.js';
import getAllJobs from '../UtilModules/getAllJobs.js';
import getAudit from '../UtilModules/getAudit.js';
import {
 guild as getBotIdFromGuild,
 token as getBotIdFromToken,
} from '../UtilModules/getBotIdFrom.js';
import getBotMemberFromGuild from '../UtilModules/getBotMemberFromGuild.js';
import getChanged from '../UtilModules/getChanged.js';
import * as getChannel from '../UtilModules/getChannel.js';
import getChannelWebhook from '../UtilModules/getChannelWebhook.js';
import getChunks from '../UtilModules/getChunks.js';
import getColor from '../UtilModules/getColor.js';
import getCustomCommand from '../UtilModules/getCustomCommand.js';
import getDifference from '../UtilModules/getDifference.js';
import getDiscordEmbed from '../UtilModules/getDiscordEmbed.js';
import getDuration from '../UtilModules/getDuration.js';
import getEmote from '../UtilModules/getEmote.js';
import getEvents from '../UtilModules/getEvents.js';
import { getLanguage } from '../UtilModules/getLanguage.js';
import getLogChannels from '../UtilModules/getLogChannels.js';
import getMessage from '../UtilModules/getMessage.js';
import getNameAndFileType from '../UtilModules/getNameAndFileType.js';
import getPathFromError from '../UtilModules/getPathFromError.js';
import getPunishment from '../UtilModules/getPunishment.js';
import getRandom from '../UtilModules/getRandom.js';
import getReferenceMessage from '../UtilModules/getReferenceMessage.js';
import getSerializedChannelPerms from '../UtilModules/getSerializedChannelPerms.js';
import getStringChunks from '../UtilModules/getStringChunks.js';
import getTarget from '../UtilModules/getTarget.js';
import getTargetChannel from '../UtilModules/getTargetChannel.js';
import getTrueChannelType from '../UtilModules/getTrueChannelType.js';
import getUnix from '../UtilModules/getUnix.js';
import getUser from '../UtilModules/getUser.js';
import getUserFromUserAndUsernameOptions from '../UtilModules/getUserFromUserAndUsernameOptions.js';
import guildOnly from '../UtilModules/guildOnly.js';
import helpHelpers from '../UtilModules/helpHelpers.js';
import interactionHelpers from '../UtilModules/interactionHelpers.js';
import isDeleteable from '../UtilModules/isDeleteable.js';
import isEditable from '../UtilModules/isEditable.js';
import loadingEmbed from '../UtilModules/loadingEmbed.js';
import log from '../UtilModules/log.js';
import makeStp from '../UtilModules/makeStp.js';
import makeTable from '../UtilModules/makeTable.js';
import memberBoostCalc from '../UtilModules/memberBoostCalc.js';
import mergeLogging from '../UtilModules/mergeLogging.js';
import mod from '../UtilModules/mod.js';
import moment from '../UtilModules/moment.js';
import notYours from '../UtilModules/notYours.js';
import notificationThread from '../UtilModules/notificationThread.js';
import permCalc from '../UtilModules/permCalc.js';
import permError from '../UtilModules/permError.js';
import refreshToken from '../UtilModules/refreshToken.js';
import regexes from '../UtilModules/regexes.js';
import replyCmd from '../UtilModules/replyCmd.js';
import replyMsg from '../UtilModules/replyMsg.js';
import requestHandler, { request } from '../UtilModules/requestHandler.js';
import roleManager from '../UtilModules/roleManager.js';
import send from '../UtilModules/send.js';
import settingsHelpers from '../UtilModules/settingsHelpers.js';
import sleep from '../UtilModules/sleep.js';
import spaces from '../UtilModules/spaces.js';
import splitByThousand from '../UtilModules/splitByThousands.js';
import stp from '../UtilModules/stp.js';
import txtFileLinkToString from '../UtilModules/txtFileLinkToString.js';
import txtFileWriter from '../UtilModules/txtFileWriter.js';
import userFlagsCalc from '../UtilModules/userFlagsCalc.js';
import channelStatusManager from '../UtilModules/channelStatusManager.js';
import * as utils from '../UtilModules/util.js';
import DataBase from './DataBase.js';
import setRatelimit from '../UtilModules/setRatelimit.js';
import getRatelimit from '../UtilModules/getRatelimit.js';
import cacheDB, { scheduleDB } from '../Bot/Redis.js';
import { ScheduleManager } from '../UtilModules/ScheduleManager.js';

const logFiles = {
 ratelimits: fs.createWriteStream(
  `${process.cwd()}/logs/ratelimits-${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}.log`,
  { flags: 'a' },
 ),
};

const scheduleManager = new ScheduleManager(scheduleDB);

interface Util {
 getPathFromError: typeof getPathFromError;
 getAllJobs: typeof getAllJobs;
 makeTable: typeof makeTable;
 deleteNotificationThread: typeof deleteNotificationThread;
 notificationThread: typeof notificationThread;
 DataBase: typeof DataBase;
 arrayBufferToBuffer: typeof arrayBufferToBuffer;
 arrayEquals: typeof arrayEquals;
 bitUniques: typeof bitUniques;
 cache: typeof cache;
 channelRuleCalc: typeof channelRuleCalc;
 constants: typeof constants;
 disableComponents: typeof disableComponents;
 dynamicToEmbed: typeof dynamicToEmbed;
 emotes: typeof emotes;
 encodeString2BigInt: typeof encodeString2BigInt;
 error: typeof error;
 errorCmd: typeof errorCmd;
 errorMsg: typeof errorMsg;
 fetchAllEventSubscribers: typeof fetchAllEventSubscribers;
 fetchAllGuildMembers: typeof fetchAllGuildMembers;
 fetchMessages: typeof fetchMessages;
 fetchWithRedirects: typeof fetchWithRedirects;
 fileURL2Buffer: typeof fileURL2Buffer;
 findServerByName: typeof findServerByName;
 findUserByName: typeof findUserByName;
 firstGuildInteraction: typeof firstGuildInteraction;
 firstChannelInteraction: typeof firstChannelInteraction;
 getAllBans: typeof getAllBans;
 getAllInvites: typeof getAllInvites;
 getAudit: typeof getAudit;
 getBotIdFromGuild: typeof getBotIdFromGuild;
 getBotIdFromToken: typeof getBotIdFromToken;
 getBotMemberFromGuild: typeof getBotMemberFromGuild;
 getChanged: typeof getChanged;
 getChannel: typeof getChannel;
 getChannelWebhook: typeof getChannelWebhook;
 getChunks: typeof getChunks;
 getColor: typeof getColor;
 getCustomCommand: typeof getCustomCommand;
 getDifference: typeof getDifference;
 getDiscordEmbed: typeof getDiscordEmbed;
 getDuration: typeof getDuration;
 getEmote: typeof getEmote;
 getEvents: typeof getEvents;
 getLanguage: typeof getLanguage;
 getLogChannels: typeof getLogChannels;
 getMessage: typeof getMessage;
 getNameAndFileType: typeof getNameAndFileType;
 getPunishment: typeof getPunishment;
 getRandom: typeof getRandom;
 getReferenceMessage: typeof getReferenceMessage;
 getSerializedChannelPerms: typeof getSerializedChannelPerms;
 getStringChunks: typeof getStringChunks;
 getTarget: typeof getTarget;
 getTargetChannel: typeof getTargetChannel;
 getTrueChannelType: typeof getTrueChannelType;
 getUnix: typeof getUnix;
 getUser: typeof getUser;
 getUserFromUserAndUsernameOptions: typeof getUserFromUserAndUsernameOptions;
 helpHelpers: typeof helpHelpers;
 interactionHelpers: typeof interactionHelpers;
 isDeleteable: typeof isDeleteable;
 isEditable: typeof isEditable;
 loadingEmbed: typeof loadingEmbed;
 log: typeof log;
 logFiles: typeof logFiles;
 makeStp: typeof makeStp;
 memberBoostCalc: typeof memberBoostCalc;
 mergeLogging: typeof mergeLogging;
 mod: typeof mod;
 moment: typeof moment;
 notYours: typeof notYours;
 permCalc: typeof permCalc;
 permError: typeof permError;
 refreshToken: typeof refreshToken;
 regexes: typeof regexes;
 replyCmd: typeof replyCmd;
 replyMsg: typeof replyMsg;
 request: typeof request;
 requestHandler: typeof requestHandler;
 roleManager: typeof roleManager;
 send: typeof send;
 settingsHelpers: typeof settingsHelpers;
 sleep: typeof sleep;
 spaces: typeof spaces;
 splitByThousand: typeof splitByThousand;
 stp: typeof stp;
 txtFileLinkToString: typeof txtFileLinkToString;
 txtFileWriter: typeof txtFileWriter;
 userFlagsCalc: typeof userFlagsCalc;
 util: typeof utils;
 files: typeof files;
 guildOnly: typeof guildOnly;
 Colors: typeof Colors;
 channelStatusManager: typeof channelStatusManager;
 setRatelimit: typeof setRatelimit;
 getRatelimit: typeof getRatelimit;
 redis: typeof cacheDB;
 scheduleManager: typeof scheduleManager;
}

const util: Util = {
 getPathFromError,
 getAllJobs,
 makeTable,
 deleteNotificationThread,
 notificationThread,
 DataBase,
 arrayBufferToBuffer,
 arrayEquals,
 bitUniques,
 cache,
 channelRuleCalc,
 constants,
 disableComponents,
 dynamicToEmbed,
 emotes,
 encodeString2BigInt,
 error,
 errorCmd,
 errorMsg,
 fetchAllEventSubscribers,
 fetchAllGuildMembers,
 fetchMessages,
 fetchWithRedirects,
 fileURL2Buffer,
 findServerByName,
 findUserByName,
 firstGuildInteraction,
 firstChannelInteraction,
 getAllBans,
 getAllInvites,
 getAudit,
 getBotIdFromGuild,
 getBotIdFromToken,
 getBotMemberFromGuild,
 getChanged,
 getChannel,
 getChannelWebhook,
 getChunks,
 getColor,
 getCustomCommand,
 getDifference,
 getDiscordEmbed,
 getDuration,
 getEmote,
 getEvents,
 getLanguage,
 getLogChannels,
 getMessage,
 getNameAndFileType,
 getPunishment,
 getRandom,
 getReferenceMessage,
 getSerializedChannelPerms,
 getStringChunks,
 getTarget,
 getTargetChannel,
 getTrueChannelType,
 getUnix,
 getUser,
 getUserFromUserAndUsernameOptions,
 helpHelpers,
 interactionHelpers,
 isDeleteable,
 isEditable,
 loadingEmbed,
 log,
 logFiles,
 makeStp,
 memberBoostCalc,
 mergeLogging,
 mod,
 moment,
 notYours,
 permCalc,
 permError,
 refreshToken,
 regexes,
 replyCmd,
 replyMsg,
 request,
 requestHandler,
 roleManager,
 send,
 settingsHelpers,
 sleep,
 spaces,
 splitByThousand,
 stp,
 txtFileLinkToString,
 txtFileWriter,
 userFlagsCalc,
 util: utils,
 files,
 guildOnly,
 Colors,
 channelStatusManager,
 setRatelimit,
 getRatelimit,
 scheduleManager,
 redis: cacheDB,
};

export default util;
