import * as CT from '../../../Typings/Typings.js';
import DataBase from '../../Bot/DataBase.js';
import type * as ModTypes from '../mod.js';

export default async <T extends CT.ModTypes>(
 cmd: ModTypes.CmdType,
 options: CT.ModOptions<T>,
 language: CT.Language,
 type: T,
) => {
 const baseData = {
  guildid: options.guild.id,
  userid: options.target.id,
  reason: options.reason,
  uniquetimestamp: Date.now(),
  channelid: cmd?.channelId ?? language.t.Unknown,
  channelname: cmd?.channel?.name ?? language.t.Unknown,
  executorid: options.executor.id,
  executorname: options.executor.username,
  msgid: cmd?.id ?? language.t.Unknown,
 };

 switch (type) {
  case 'banAdd':
   return DataBase.punish_bans.create({
    data: baseData,
   });
  case 'channelBanAdd': {
   const opts = options as unknown as CT.ModOptions<CT.ModTypes.ChannelBanAdd>;
   return DataBase.punish_channelbans.create({
    data: { ...baseData, banchannelid: opts.channel.id },
   });
  }
  case 'kickAdd':
   return DataBase.punish_kicks.create({
    data: baseData,
   });
  case 'tempBanAdd': {
   const opts = options as unknown as CT.ModOptions<CT.ModTypes.TempBanAdd>;
   return DataBase.punish_tempbans.create({
    data: { ...baseData, duration: opts.duration },
   });
  }
  case 'tempChannelBanAdd': {
   const opts = options as unknown as CT.ModOptions<CT.ModTypes.TempChannelBanAdd>;
   return DataBase.punish_tempchannelbans.create({
    data: { ...baseData, banchannelid: opts.channel.id, duration: opts.duration },
   });
  }
  case 'tempMuteAdd': {
   const opts = options as unknown as CT.ModOptions<CT.ModTypes.TempMuteAdd>;
   return DataBase.punish_tempmutes.create({
    data: { ...baseData, duration: opts.duration },
   });
  }
  case 'warnAdd':
   return DataBase.punish_warns.create({
    data: baseData,
   });
  case 'muteRemove': {
   const opts = options as unknown as CT.ModOptions<CT.ModTypes.MuteRemove>;

   const prevMute = await DataBase.punish_tempmutes.findFirst({
    where: { userid: opts.target.id, guildid: opts.guild.id },
   });

   if (prevMute) {
    await DataBase.punish_tempmutes
     .delete({
      where: { uniquetimestamp: prevMute.uniquetimestamp },
     })
     .then();
   }

   return prevMute
    ? DataBase.punish_mutes.create({
       data: prevMute,
      })
    : undefined;
  }
  case 'channelBanRemove': {
   const opts = options as unknown as CT.ModOptions<CT.ModTypes.ChannelBanRemove>;
   const prevCBan = await DataBase.punish_tempchannelbans.findFirst({
    where: { userid: opts.target.id, guildid: opts.guild.id },
   });

   if (prevCBan) {
    DataBase.punish_channelbans
     .delete({ where: { uniquetimestamp: prevCBan.uniquetimestamp } })
     .then();
   }

   return prevCBan
    ? DataBase.punish_channelbans.create({
       data: prevCBan,
      })
    : undefined;
  }
  case 'banRemove': {
   const opts = options as unknown as CT.ModOptions<CT.ModTypes.BanRemove>;
   const prevBan = await DataBase.punish_tempbans.findFirst({
    where: { userid: opts.target.id, guildid: opts.guild.id },
   });

   if (prevBan) {
    DataBase.punish_tempbans.delete({ where: { uniquetimestamp: prevBan.uniquetimestamp } }).then();
   }

   return prevBan
    ? DataBase.punish_bans.create({
       data: prevBan,
      })
    : undefined;
  }
  case 'softBanAdd':
  case 'strikeAdd':
  case 'softWarnAdd':
  case 'roleRemove':
  case 'roleAdd':
   return undefined;
  default: {
   throw new Error(`Unknown modType in DB fn ${type}`);
  }
 }
};
