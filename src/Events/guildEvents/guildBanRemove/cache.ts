import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (ban: Discord.GuildBan) => {
 await ch.firstGuildInteraction(ban.guild);

 ch.cache.bans.delete(ban.user.id, ban.guild.id);

 const res = await ch.DataBase.punish_tempbans.findMany({
  where: {
   guildid: ban.guild.id,
   userid: ban.user.id,
   reason: ban.reason,
  },
 });

 if (!res.length) return;

 res.forEach(async (data) => {
  ch.DataBase.punish_tempbans.delete({ where: { uniquetimestamp: data.uniquetimestamp } }).then();
  ch.DataBase.punish_bans.create({ data }).then();
 });
};
