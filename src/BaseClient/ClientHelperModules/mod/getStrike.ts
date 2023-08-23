import * as Discord from 'discord.js';
import * as CT from '../../../Typings/CustomTypings.js';

import DataBase from '../../DataBase.js';
import getPunishment from '../getPunishment.js';

export default async (user: Discord.User | CT.bEvalUser, guild: Discord.Guild) => {
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
