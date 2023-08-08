import * as Discord from 'discord.js';
import DataBase from '../DataBase.js';
import getPunishment from './getPunishment.js';
import * as CT from '../../Typings/CustomTypings.js';
import mod from './mod.js';

export default async <T extends CT.ModTypes>(
 msg: Discord.Message<true>,
 user: Discord.User,
 guild: Discord.Guild,
 modOptions: CT.ModOptions<T>,
) => {
 const strike = await getStrike(user, guild);
 if (!strike) return;

 switch (strike.punishment) {
  case 'ban':
   mod(msg, 'banAdd', modOptions);
   break;
  case 'channelban':
   mod(msg, 'channelBanAdd', modOptions as CT.ModOptions<'channelBanAdd'>);
   break;
  case 'kick':
   mod(msg, 'kickAdd', modOptions);
   break;
  case 'tempmute':
   mod(msg, 'tempMuteAdd', { ...modOptions, duration: strike.duration.toNumber() * 1000 });
   break;
  case 'tempchannelban':
   mod(msg, 'tempChannelBanAdd', {
    ...modOptions,
    duration: strike.duration.toNumber() * 1000,
   } as CT.ModOptions<'tempChannelBanAdd'>);
   break;
  case 'warn':
   mod(msg, 'warnAdd', modOptions);
   break;
  case 'tempban':
   mod(msg, 'tempBanAdd', { ...modOptions, duration: strike.duration.toNumber() * 1000 });
   break;
  default: {
   mod(msg, 'softWarnAdd', modOptions);
   break;
  }
 }
};

const getStrike = async (user: Discord.User, guild: Discord.Guild) => {
 const punishments = await getPunishment(user.id, 'all-on');
 const strikeSettings = await DataBase.autopunish.findMany({
  where: {
   guildid: guild.id,
   active: true,
   warnamount: { gte: Number(punishments?.length) },
  },
  orderBy: { warnamount: 'desc' },
 });

 return strikeSettings[0];
};
