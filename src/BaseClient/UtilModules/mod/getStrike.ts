import * as Discord from 'discord.js';

import DataBase from '../../Bot/DataBase.js';
import getPunishment from '../getPunishment.js';

export default async (user: Discord.User, guild: Discord.Guild) => {
 const punishments = await getPunishment(user.id, { identType: 'all-on', guildid: guild.id });

 return DataBase.autopunish.findFirst({
  where: {
   guildid: guild.id,
   active: true,
   warnamount: { lte: Number(punishments?.length) },
  },
  orderBy: { warnamount: 'desc' },
 });
};
