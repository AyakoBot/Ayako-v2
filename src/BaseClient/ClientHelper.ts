import type * as Discord from 'discord.js';
import type Jobs from 'node-schedule';

import arrayBufferToBuffer from './ClientHelperModules/arrayBufferToBuffer.js';
import arrayEquals from './ClientHelperModules/arrayEquals.js';
import bitUniques from './ClientHelperModules/bitUniques.js';
import cache from './ClientHelperModules/cache.js';
import channelRuleCalc from './ClientHelperModules/channelRuleCalc.js';
import disableComponents from './ClientHelperModules/disableComponents.js';
import dynamicToEmbed from './ClientHelperModules/dynamicToEmbed.js';
import emotes from './ClientHelperModules/emotes.js';
import encodeString2BigInt from './ClientHelperModules/encodeString2BigInt.js';
import error from './ClientHelperModules/error.js';
import errorCmd from './ClientHelperModules/errorCmd.js';
import errorMsg from './ClientHelperModules/errorMsg.js';
import fetchAllEventSubscribers from './ClientHelperModules/fetchAllEventSubscribers.js';
import fetchAllGuildMembers from './ClientHelperModules/fetchAllGuildMembers.js';
import fetchMessages from './ClientHelperModules/fetchMessages.js';
import fetchWithRedirects from './ClientHelperModules/fetchWithRedirects.js';
import fileURL2Buffer from './ClientHelperModules/fileURL2Buffer.js';
import findServerByName from './ClientHelperModules/findServerByName.js';
import findUserByName from './ClientHelperModules/findUserByName.js';
import getAllBans from './ClientHelperModules/getAllBans.js';
import getAllInvites from './ClientHelperModules/getAllInvites.js';
import getAudit from './ClientHelperModules/getAudit.js';
import {
 guild as getBotIdFromGuild,
 token as getBotIdFromToken,
} from './ClientHelperModules/getBotIdFrom.js';
import getBotMemberFromGuild from './ClientHelperModules/getBotMemberFromGuild.js';
import getChanged from './ClientHelperModules/getChanged.js';
import * as getChannel from './ClientHelperModules/getChannel.js';
import getChannelWebhook from './ClientHelperModules/getChannelWebhook.js';
import getChunks from './ClientHelperModules/getChunks.js';
import getColor from './ClientHelperModules/getColor.js';
import getCustomCommand from './ClientHelperModules/getCustomCommand.js';
import getDifference from './ClientHelperModules/getDifference.js';
import getDiscordEmbed from './ClientHelperModules/getDiscordEmbed.js';
import getDuration from './ClientHelperModules/getDuration.js';
import getEmote from './ClientHelperModules/getEmote.js';
import getEvents from './ClientHelperModules/getEvents.js';
import getGif from './ClientHelperModules/getGif.js';
import getLanguage from './ClientHelperModules/getLanguage.js';
import getLogChannels from './ClientHelperModules/getLogChannels.js';
import getMessage from './ClientHelperModules/getMessage.js';
import getNameAndFileType from './ClientHelperModules/getNameAndFileType.js';
import getPunishment from './ClientHelperModules/getPunishment.js';
import getRandom from './ClientHelperModules/getRandom.js';
import getReferenceMessage from './ClientHelperModules/getReferenceMessage.js';
import getSerializedChannelPerms from './ClientHelperModules/getSerializedChannelPerms.js';
import getStringChunks from './ClientHelperModules/getStringChunks.js';
import getTarget from './ClientHelperModules/getTarget.js';
import getTargetChannel from './ClientHelperModules/getTargetChannel.js';
import getTrueChannelType from './ClientHelperModules/getTrueChannelType.js';
import getUnix from './ClientHelperModules/getUnix.js';
import getUser from './ClientHelperModules/getUser.js';
import getUserFromUserAndUsernameOptions from './ClientHelperModules/getUserFromUserAndUsernameOptions.js';
import helpHelpers from './ClientHelperModules/helpHelpers.js';
import interactionHelpers from './ClientHelperModules/interactionHelpers.js';
import isDeleteable from './ClientHelperModules/isDeleteable.js';
import isEditable from './ClientHelperModules/isEditable.js';
import isManageable from './ClientHelperModules/isManageable.js';
import isModeratable from './ClientHelperModules/isModeratable.js';
import loadingEmbed from './ClientHelperModules/loadingEmbed.js';
import log from './ClientHelperModules/log.js';
import makeStp from './ClientHelperModules/makeStp.js';
import memberBoostCalc from './ClientHelperModules/memberBoostCalc.js';
import mergeLogging from './ClientHelperModules/mergeLogging.js';
import mod from './ClientHelperModules/mod.js';
import moment from './ClientHelperModules/moment.js';
import notYours from './ClientHelperModules/notYours.js';
import permCalc from './ClientHelperModules/permCalc.js';
import permError from './ClientHelperModules/permError.js';
import refreshToken from './ClientHelperModules/refreshToken.js';
import regexes from './ClientHelperModules/regexes.js';
import replyCmd from './ClientHelperModules/replyCmd.js';
import replyMsg from './ClientHelperModules/replyMsg.js';
import requestHandler, { request } from './ClientHelperModules/requestHandler.js';
import roleManager from './ClientHelperModules/roleManager.js';
import send from './ClientHelperModules/send.js';
import settingsHelpers from './ClientHelperModules/settingsHelpers.js';
import sleep from './ClientHelperModules/sleep.js';
import spaces from './ClientHelperModules/spaces.js';
import splitByThousand from './ClientHelperModules/splitByThousands.js';
import stp from './ClientHelperModules/stp.js';
import txtFileLinkToString from './ClientHelperModules/txtFileLinkToString.js';
import txtFileWriter from './ClientHelperModules/txtFileWriter.js';
import userFlagsCalc from './ClientHelperModules/userFlagsCalc.js';
import * as util from './ClientHelperModules/util.js';
import DataBase from './DataBase.js';
import constants from './Other/constants.js';

const mainID = '650691698409734151';
type ChannelQueue = Map<string, Map<string, Discord.APIEmbed[]>>;
type ChannelTimeouts = Map<string, Map<string, Jobs.Job>>;
const channelQueue: ChannelQueue = new Map();
const channelTimeout: ChannelTimeouts = new Map();

export {
 DataBase,
 arrayBufferToBuffer,
 arrayEquals,
 bitUniques,
 cache,
 channelQueue,
 channelRuleCalc,
 channelTimeout,
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
 getGif,
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
 isManageable,
 isModeratable,
 loadingEmbed,
 log,
 mainID,
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
 util,
};
