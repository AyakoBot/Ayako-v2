import * as Discord from 'discord.js';

import DataBase from '../../DataBase.js';
import getPunishment from '../getPunishment.js';

export default async (user: Discord.User, guild: Discord.Guild) => {
 const punishments = await getPunishment(user.id, 'all-on');

 return DataBase.autopunish.findFirst({
  where: {
   guildid: guild.id,
   active: true,
   warnamount: { lte: Number(punishments?.length) },
  },
  orderBy: { warnamount: 'desc' },
 });
};
