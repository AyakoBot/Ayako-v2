import Prisma from '@prisma/client';
import * as CT from '../../../../Typings/Typings.js';

import cache from '../../cache.js';
import error from '../../error.js';
import type * as ModTypes from '../../mod.js';

import getMembers from '../getMembers.js';
import getStrike from '../getStrike.js';

import banAdd from './banAdd.js';
import channelBanAdd from './channelBanAdd.js';
import kickAdd from './kickAdd.js';
import softBanAdd from './softBanAdd.js';
import softWarnAdd from './softWarnAdd.js';
import tempBanAdd from './tempBanAdd.js';
import tempChannelBanAdd from './tempChannelBanAdd.js';
import tempMuteAdd from './tempMuteAdd.js';
import warnAdd from './warnAdd.js';

export default async <T extends CT.ModTypes>(
 rawOpts: CT.ModOptions<CT.ModTypes.StrikeAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
): Promise<{ success: boolean; type: CT.ModTypes; options: CT.ModOptions<T> }> => {
 const options = rawOpts as CT.ModOptions<T>;
 const strike = await getStrike(options.target, options.guild);

 const memberRes = await getMembers(cmd, options, language, message, CT.ModTypes.StrikeAdd);
 if (memberRes && !memberRes.canExecute) {
  return { success: false, type: CT.ModTypes.StrikeAdd, options: options as CT.ModOptions<T> };
 }

 if (!strike) {
  cache.punishments.delete(options.target.id);
  rawOpts.guild.client.util.files['/BaseClient/UtilModules/mod.js'](
   cmd,
   CT.ModTypes.WarnAdd,
   options,
   message,
  );
  return { success: false, type: CT.ModTypes.StrikeAdd, options: options as CT.ModOptions<T> };
 }

 if (!cmd) {
  error(options.guild, new Error('Guild not found'));
  return { success: false, type: CT.ModTypes.StrikeAdd, options: options as CT.ModOptions<T> };
 }

 switch (strike.punishment) {
  case Prisma.$Enums.AutoPunishPunishmentType.ban: {
   const opts = {
    ...options,
    deleteMessageSeconds:
     Number(strike.deletemessageseconds) > 604800 ? 604800 : Number(strike.deletemessageseconds),
   };

   return {
    success: await banAdd(opts, language, message, cmd),
    type: CT.ModTypes.BanAdd,
    options: opts,
   };
  }
  case Prisma.$Enums.AutoPunishPunishmentType.channelban: {
   if (!cmd.channel) {
    error(cmd.guild, new Error('No Channel found in strikeAdd'));
    return { success: false, type: CT.ModTypes.StrikeAdd, options };
   }

   const opts = {
    ...options,
    channel: cmd.channel.isThread()
     ? (cmd.channel.parent as NonNullable<typeof cmd.channel.parent>)
     : cmd.channel,
   };

   return {
    success: await channelBanAdd(opts, language, message, cmd),
    type: CT.ModTypes.ChannelBanAdd,
    options: opts,
   };
  }
  case Prisma.$Enums.AutoPunishPunishmentType.kick:
   return {
    success: await kickAdd(options, language, message, cmd),
    type: CT.ModTypes.KickAdd,
    options,
   };
  case Prisma.$Enums.AutoPunishPunishmentType.tempmute: {
   const opts = {
    ...options,
    duration: Number(strike.duration),
   };

   return {
    success: await tempMuteAdd(
     { ...options, duration: Number(strike.duration) },
     language,
     message,
     cmd,
    ),
    type: CT.ModTypes.TempMuteAdd,
    options: opts,
   };
  }
  case Prisma.$Enums.AutoPunishPunishmentType.tempchannelban: {
   if (!cmd.channel) {
    error(cmd.guild, new Error('No channel found in strikeAdd'));
    return { success: false, type: CT.ModTypes.StrikeAdd, options };
   }

   const opts = {
    ...options,
    duration: Number(strike.duration),
    channel: cmd.channel.isThread()
     ? (cmd.channel.parent as NonNullable<typeof cmd.channel.parent>)
     : cmd.channel,
   };

   return {
    success: await tempChannelBanAdd(opts, language, message, cmd),
    type: CT.ModTypes.TempChannelBanAdd,
    options: opts,
   };
  }
  case Prisma.$Enums.AutoPunishPunishmentType.warn:
   return {
    success: await warnAdd(options, language, message, cmd),
    type: CT.ModTypes.WarnAdd,
    options,
   };
  case Prisma.$Enums.AutoPunishPunishmentType.tempban: {
   const opts = {
    ...options,
    duration: Number(strike.duration),
    deleteMessageSeconds:
     Number(strike.deletemessageseconds) > 604800 ? 604800 : Number(strike.deletemessageseconds),
   };

   return {
    success: await tempBanAdd(opts, language, message, cmd),
    type: CT.ModTypes.TempBanAdd,
    options: opts,
   };
  }
  case Prisma.$Enums.AutoPunishPunishmentType.softban: {
   const opts = {
    ...options,
    deleteMessageSeconds:
     Number(strike.deletemessageseconds) > 604800 ? 604800 : Number(strike.deletemessageseconds),
   };

   return {
    success: await softBanAdd(opts, language, message, cmd),
    type: CT.ModTypes.SoftBanAdd,
    options: opts,
   };
  }
  default: {
   return {
    success: await softWarnAdd(),
    type: CT.ModTypes.SoftWarnAdd,
    options,
   };
  }
 }
};
