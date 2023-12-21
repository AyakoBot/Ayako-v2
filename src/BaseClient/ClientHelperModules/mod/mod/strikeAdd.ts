import * as CT from '../../../../Typings/CustomTypings.js';

import error from '../../error.js';
import cache from '../../cache.js';
import type * as ModTypes from '../../mod.js';

import getStrike from '../getStrike.js';

import banAdd from './banAdd.js';
import channelBanAdd from './channelBanAdd.js';
import kickAdd from './kickAdd.js';
import tempMuteAdd from './tempMuteAdd.js';
import tempChannelBanAdd from './tempChannelBanAdd.js';
import warnAdd from './warnAdd.js';
import tempBanAdd from './tempBanAdd.js';
import softBanAdd from './softBanAdd.js';
import softWarnAdd from './softWarnAdd.js';

export default async <T extends CT.ModTypes>(
 rawOpts: CT.ModOptions<CT.ModTypes.StrikeAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
): Promise<{ success: Promise<boolean> | false; type: CT.ModTypes; options: CT.ModOptions<T> }> => {
 const options = rawOpts as CT.ModOptions<T>;
 const strike = await getStrike(options.target, options.guild);

 if (!strike) {
  cache.punishments.delete(options.target.id);
  (await import(`../../mod.js`)).default(cmd, CT.ModTypes.WarnAdd, options, message);
  return { success: false, type: CT.ModTypes.StrikeAdd, options: options as CT.ModOptions<T> };
 }

 if (!cmd) {
  error(options.guild, new Error('Guild not found'));
  return { success: false, type: CT.ModTypes.StrikeAdd, options: options as CT.ModOptions<T> };
 }

 switch (strike.punishment) {
  case 'ban': {
   const opts = {
    ...options,
    deleteMessageSeconds:
     Number(strike.deletemessageseconds) > 604800 ? 604800 : Number(strike.deletemessageseconds),
   };

   return {
    success: banAdd(opts, language, message, cmd),
    type: CT.ModTypes.BanAdd,
    options: opts,
   };
  }
  case 'channelban': {
   if (!cmd.channel) {
    error(cmd.guild, new Error('No Channel found in strikeAdd'));
    return { success: false, type: CT.ModTypes.StrikeAdd, options };
   }

   const opts = {
    ...options,
    deleteMessageSeconds:
     Number(strike.deletemessageseconds) > 604800 ? 604800 : Number(strike.deletemessageseconds),
   };

   return {
    success: channelBanAdd(
     {
      ...options,
      channel: cmd.channel.isThread()
       ? (cmd.channel.parent as NonNullable<typeof cmd.channel.parent>)
       : cmd.channel,
     },
     language,
     message,
     cmd,
    ),
    type: CT.ModTypes.ChannelBanAdd,
    options: opts,
   };
  }
  case 'kick':
   return {
    success: kickAdd(options, language, message, cmd),
    type: CT.ModTypes.KickAdd,
    options,
   };
  case 'tempmute':
   return {
    success: tempMuteAdd({ ...options, duration: Number(strike.duration) }, language, message, cmd),
    type: CT.ModTypes.TempMuteAdd,
    options,
   };
  case 'tempchannelban': {
   if (!cmd.channel) {
    error(cmd.guild, new Error('No channel found in strikeAdd'));
    return { success: false, type: CT.ModTypes.StrikeAdd, options };
   }

   const opts = {
    ...options,
    duration: Number(strike.duration) * 1000,
    channel: cmd.channel.isThread()
     ? (cmd.channel.parent as NonNullable<typeof cmd.channel.parent>)
     : cmd.channel,
   };

   return {
    success: tempChannelBanAdd(opts, language, message, cmd),
    type: CT.ModTypes.TempChannelBanAdd,
    options: opts,
   };
  }
  case 'warn':
   return { success: warnAdd(), type: CT.ModTypes.WarnAdd, options };
  case 'tempban': {
   const opts = {
    ...options,
    duration: Number(strike.duration) * 1000,
    deleteMessageSeconds:
     Number(strike.deletemessageseconds) > 604800 ? 604800 : Number(strike.deletemessageseconds),
   };

   return {
    success: tempBanAdd(opts, language, message, cmd),
    type: CT.ModTypes.TempBanAdd,
    options: opts,
   };
  }
  case 'softban': {
   const opts = {
    ...options,
    deleteMessageSeconds:
     Number(strike.deletemessageseconds) > 604800 ? 604800 : Number(strike.deletemessageseconds),
   };

   return {
    success: softBanAdd(opts, language, message, cmd),
    type: CT.ModTypes.SoftBanAdd,
    options: opts,
   };
  }
  default: {
   return {
    success: softWarnAdd(),
    type: CT.ModTypes.SoftWarnAdd,
    options,
   };
  }
 }
};
