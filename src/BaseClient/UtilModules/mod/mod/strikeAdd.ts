import Prisma from '@prisma/client';
import type * as CT from '../../../../Typings/Typings.js';
import type * as ModTypes from '../../mod.js';

export default async <T extends CT.ModTypes>(
 rawOpts: CT.ModOptions<CT.ModTypes.StrikeAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
): Promise<{ success: boolean; type: CT.ModTypes; options: CT.ModOptions<T> }> => {
 const options = rawOpts as CT.ModOptions<T>;
 const strike = await options.guild.client.util.mod.getStrike(options.target, options.guild);

 const memberRes = await options.guild.client.util.mod.getMembers(
  cmd,
  options,
  language,
  message,
  options.guild.client.util.CT.ModTypes.StrikeAdd,
 );
 if (memberRes && !memberRes.canExecute) {
  return {
   success: false,
   type: options.guild.client.util.CT.ModTypes.StrikeAdd,
   options: options as CT.ModOptions<T>,
  };
 }

 if (!strike) {
  options.guild.client.util.cache.punishments.delete(options.target.id);
  options.guild.client.util.mod.file(
   cmd,
   options.guild.client.util.CT.ModTypes.WarnAdd,
   options,
   message,
  );
  return {
   success: false,
   type: options.guild.client.util.CT.ModTypes.StrikeAdd,
   options: options as CT.ModOptions<T>,
  };
 }

 if (!cmd) {
  options.guild.client.util.error(options.guild, new Error('Guild not found'));
  return {
   success: false,
   type: options.guild.client.util.CT.ModTypes.StrikeAdd,
   options: options as CT.ModOptions<T>,
  };
 }

 switch (strike.punishment) {
  case Prisma.$Enums.AutoPunishPunishmentType.ban: {
   const opts = {
    ...options,
    deleteMessageSeconds:
     Number(strike.deletemessageseconds) > 604800 ? 604800 : Number(strike.deletemessageseconds),
   };

   return {
    success: await options.guild.client.util.mod.mod.banAdd(opts, language, message, cmd),
    type: options.guild.client.util.CT.ModTypes.BanAdd,
    options: opts,
   };
  }
  case Prisma.$Enums.AutoPunishPunishmentType.channelban: {
   if (!cmd.channel) {
    options.guild.client.util.error(cmd.guild, new Error('No Channel found in strikeAdd'));
    return { success: false, type: options.guild.client.util.CT.ModTypes.StrikeAdd, options };
   }

   const opts = {
    ...options,
    channel: cmd.channel.isThread()
     ? (cmd.channel.parent as NonNullable<typeof cmd.channel.parent>)
     : cmd.channel,
   };

   return {
    success: await options.guild.client.util.mod.mod.channelBanAdd(opts, language, message, cmd),
    type: options.guild.client.util.CT.ModTypes.ChannelBanAdd,
    options: opts,
   };
  }
  case Prisma.$Enums.AutoPunishPunishmentType.kick:
   return {
    success: await options.guild.client.util.mod.mod.kickAdd(options, language, message, cmd),
    type: options.guild.client.util.CT.ModTypes.KickAdd,
    options,
   };
  case Prisma.$Enums.AutoPunishPunishmentType.tempmute: {
   const opts = {
    ...options,
    duration: Number(strike.duration) * 1000,
   };

   return {
    success: await options.guild.client.util.mod.mod.tempMuteAdd(
     { ...options, duration: Number(strike.duration) },
     language,
     message,
     cmd,
    ),
    type: options.guild.client.util.CT.ModTypes.TempMuteAdd,
    options: opts,
   };
  }
  case Prisma.$Enums.AutoPunishPunishmentType.tempchannelban: {
   if (!cmd.channel) {
    options.guild.client.util.error(cmd.guild, new Error('No channel found in strikeAdd'));
    return { success: false, type: options.guild.client.util.CT.ModTypes.StrikeAdd, options };
   }

   const opts = {
    ...options,
    duration: Number(strike.duration) * 1000,
    channel: cmd.channel.isThread()
     ? (cmd.channel.parent as NonNullable<typeof cmd.channel.parent>)
     : cmd.channel,
   };

   return {
    success: await options.guild.client.util.mod.mod.tempChannelBanAdd(
     opts,
     language,
     message,
     cmd,
    ),
    type: options.guild.client.util.CT.ModTypes.TempChannelBanAdd,
    options: opts,
   };
  }
  case Prisma.$Enums.AutoPunishPunishmentType.warn:
   return {
    success: await options.guild.client.util.mod.mod.warnAdd(options, language, message, cmd),
    type: options.guild.client.util.CT.ModTypes.WarnAdd,
    options,
   };
  case Prisma.$Enums.AutoPunishPunishmentType.tempban: {
   const opts = {
    ...options,
    duration: Number(strike.duration) * 1000,
    deleteMessageSeconds:
     Number(strike.deletemessageseconds) > 604800 ? 604800 : Number(strike.deletemessageseconds),
   };

   return {
    success: await options.guild.client.util.mod.mod.tempBanAdd(opts, language, message, cmd),
    type: options.guild.client.util.CT.ModTypes.TempBanAdd,
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
    success: await options.guild.client.util.mod.mod.softBanAdd(opts, language, message, cmd),
    type: options.guild.client.util.CT.ModTypes.SoftBanAdd,
    options: opts,
   };
  }
  default: {
   return {
    success: await options.guild.client.util.mod.mod.softWarnAdd(),
    type: options.guild.client.util.CT.ModTypes.SoftWarnAdd,
    options,
   };
  }
 }
};
