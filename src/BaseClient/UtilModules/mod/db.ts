import { StoredPunishmentTypes } from '@prisma/client';
import * as CT from '../../../Typings/Typings.js';
import DataBase from '../../Bot/DataBase.js';
import type { CmdType } from '../mod.js';

const noDbTypes = [
 CT.ModTypes.UnAfk,
 CT.ModTypes.SoftWarnAdd,
 CT.ModTypes.SoftBanAdd,
 CT.ModTypes.RoleAdd,
 CT.ModTypes.RoleRemove,
];

export default async <T extends CT.ModTypes>(
 cmd: CmdType,
 options: CT.ModOptions<T>,
 language: CT.Language,
 type: T,
) => {
 if (noDbTypes.includes(type)) return undefined;

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
  context: 'channel' in options && options.channel ? options.channel.id : undefined,
  duration: 'duration' in options && options.duration ? options.duration : undefined,
  type: CT.ModType2StoredPunishmentTypes[type],
 };

 if (!baseData.type) return undefined;

 switch (type) {
  case CT.ModTypes.BanAdd:
  case CT.ModTypes.TempBanAdd:
  case CT.ModTypes.ChannelBanAdd:
  case CT.ModTypes.TempChannelBanAdd:
  case CT.ModTypes.TempMuteAdd:
  case CT.ModTypes.WarnAdd:
   return DataBase.punishments.create({ data: baseData });
  case CT.ModTypes.MuteRemove:
   return DataBase.punishments.updateMany({
    where: {
     userid: baseData.userid,
     guildid: baseData.guildid,
     type: StoredPunishmentTypes.tempmute,
    },
    data: { type: StoredPunishmentTypes.mute },
   });
  case CT.ModTypes.ChannelBanRemove:
   return DataBase.punishments.updateMany({
    where: {
     userid: baseData.userid,
     guildid: baseData.guildid,
     type: StoredPunishmentTypes.tempchannelban,
    },
    data: { type: StoredPunishmentTypes.channelban },
   });
  case CT.ModTypes.BanRemove:
   return DataBase.punishments.updateMany({
    where: {
     userid: baseData.userid,
     guildid: baseData.guildid,
     type: StoredPunishmentTypes.tempban,
    },
    data: { type: StoredPunishmentTypes.ban },
   });
  default: {
   throw new Error(`Unknown modType in DB fn ${type}`);
  }
 }
};
