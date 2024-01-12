import * as Discord from 'discord.js';

export default async (ban: Discord.GuildBan) => {
 ban.client.util.cache.bans.delete(ban.user.id, ban.guild.id);

 const res = await ban.client.util.DataBase.punish_tempbans.findMany({
  where: {
   guildid: ban.guild.id,
   userid: ban.user.id,
   reason: ban.reason,
  },
 });

 if (!res.length) return;

 res.forEach(async (data) => {
  ban.client.util.DataBase.punish_tempbans
   .delete({ where: { uniquetimestamp: data.uniquetimestamp } })
   .then();
  ban.client.util.DataBase.punish_bans.create({ data }).then();
 });
};
