import type * as Discord from 'discord.js';
import type Jobs from 'node-schedule';

/* eslint-disable max-len */
/* eslint-disable no-multi-spaces */
/* eslint-disable prettier/prettier */

export const send                       = (await import(`./ClientHelperModules/send.js`)).default;
export const replyMsg                   = (await import(`./ClientHelperModules/replyMsg.js`)).default;
export const replyCmd                   = (await import(`./ClientHelperModules/replyCmd.js`)).default;
export const query                      = (await import(`./ClientHelperModules/query.js`)).default;
export const stp                        = (await import(`./ClientHelperModules/stp.js`)).default;
export const regexes                    = (await import(`./ClientHelperModules/regexes.js`)).default;
export const fileURL2Buffer             = (await import(`./ClientHelperModules/fileURL2Buffer.js`)).default;
export const memberBoostCalc            = (await import(`./ClientHelperModules/memberBoostCalc.js`)).default;
export const userFlagsCalc              = (await import(`./ClientHelperModules/userFlagsCalc.js`)).default;
export const channelRuleCalc            = (await import(`./ClientHelperModules/channelRuleCalc.js`)).default;
export const permCalc                   = (await import(`./ClientHelperModules/permCalc.js`)).default;
export const getUnix                    = (await import(`./ClientHelperModules/getUnix.js`)).default;
export const getDifference              = (await import(`./ClientHelperModules/getDifference.js`)).default;
export const languageSelector           = (await import(`./ClientHelperModules/languageSelector.js`)).default;
export const bitUniques                 = (await import(`./ClientHelperModules/bitUniques.js`)).default;
export const txtFileWriter              = (await import(`./ClientHelperModules/txtFileWriter.js`)).default;
export const util                       =  await import(`./ClientHelperModules/util.js`);
export const errorMsg                   = (await import(`./ClientHelperModules/errorMsg.js`)).default;
export const errorCmd                   = (await import(`./ClientHelperModules/errorCmd.js`)).default;
export const permError                  = (await import(`./ClientHelperModules/permError.js`)).default;
export const notYours                   = (await import(`./ClientHelperModules/notYours.js`)).default;
export const collectorEnd               = (await import(`./ClientHelperModules/collectorEnd.js`)).default;
export const colorSelector              = (await import(`./ClientHelperModules/colorSelector.js`)).default;
export const loadingEmbed               = (await import(`./ClientHelperModules/loadingEmbed.js`)).default;
export const arrayEquals                = (await import(`./ClientHelperModules/arrayEquals.js`)).default;
export const txtFileLinkToString        = (await import(`./ClientHelperModules/txtFileLinkToString.js`)).default;
export const getAllInvites              = (await import(`./ClientHelperModules/getAllInvites.js`)).default;
export const getDiscordEmbed            = (await import(`./ClientHelperModules/getDiscordEmbed.js`)).default;
export const dynamicToEmbed             = (await import(`./ClientHelperModules/dynamicToEmbed.js`)).default;
export const embedBuilder               = (await import(`./ClientHelperModules/embedBuilder.js`)).default;
export const roleManager                = (await import(`./ClientHelperModules/roleManager.js`)).default;
export const getEmote                   = (await import(`./ClientHelperModules/getEmote.js`)).default;
export const getAudit                   = (await import(`./ClientHelperModules/getAudit.js`)).default;
export const database                   = (await import(`./DataBase.js`)).default;
export const getEmbed                   = (await import(`./ClientHelperModules/getEmbed.js`)).default;
export const getJumpLink                = (await import(`./ClientHelperModules/getJumpLink.js`)).default;
export const getLogChannels             = (await import(`./ClientHelperModules/getLogChannels.js`)).default;
export const mergeLogging               = (await import(`./ClientHelperModules/mergeLogging.js`)).default;
export const getTrueChannelType         = (await import(`./ClientHelperModules/getTrueChannelType.js`)).default;
export const moment                     = (await import(`./ClientHelperModules/moment.js`)).default;
export const getChanged                 = (await import(`./ClientHelperModules/getChanged.js`)).default;
export const spaces                     = (await import(`./ClientHelperModules/spaces.js`)).default;
export const arrayBufferToBuffer        = (await import(`./ClientHelperModules/arrayBufferToBuffer.js`)).default;
export const getChannel                 =  await import(`./ClientHelperModules/getChannel.js`);
export const getSerializedChannelPerms  = (await import(`./ClientHelperModules/getSerializedChannelPerms.js`)).default;
export const isManageable               = (await import(`./ClientHelperModules/isManageable.js`)).default;
export const getEvents                  = (await import(`./ClientHelperModules/getEvents.js`)).default;
export const getNameAndFileType         = (await import(`./ClientHelperModules/getNameAndFileType.js`)).default;
export const getUser                    = (await import(`./ClientHelperModules/getUser.js`)).default;

export const settingsHelpers            = (await import(`./ClientHelperModules/settingsHelpers.js`)).default;
export const neko                       = (await import('./NekoClient.js')).default;
export const constants                  = (await import('./Other/constants.js')).default;
export const objectEmotes               = (await import('./ClientHelperModules/objectEmotes.js')).default;
export const stringEmotes               = (await import('./ClientHelperModules/stringEmotes.js')).default;
export const reactionEmotes             = (await import('./ClientHelperModules/reactionEmotes.js')).default;
export const mainID                     =  '650691698409734151';
type CQ                                 =  Map<string, Map<string, Discord.APIEmbed[]>>
type CT                                 =  Map<string, Map<string, Jobs.Job>>
export const channelQueue: CQ           =  new Map();
export const channelTimeout: CT         =  new Map();
export const cache                      = (await import('./ClientHelperModules/cache.js')).default;