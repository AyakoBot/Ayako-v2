import * as Discord from 'discord.js';

export default async (user: Discord.User, guild: Discord.Guild) => {
 const punishments = await user.client.util.getPunishment(user.id, {
  identType: 'all-on',
  guildid: guild.id,
 });

 return user.client.util.DataBase.autopunish.findFirst({
  where: {
   guildid: guild.id,
   active: true,
   warnamount: { lte: Number(punishments?.length) },
  },
  orderBy: { warnamount: 'desc' },
 });
};
