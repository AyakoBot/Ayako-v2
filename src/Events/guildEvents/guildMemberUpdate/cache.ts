import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (oldMember: Discord.GuildMember, member: Discord.GuildMember) => {
 if (!oldMember.isCommunicationDisabled()) return;
 if (member.isCommunicationDisabled()) return;

 const res = await ch.DataBase.punish_tempmutes.findMany({
  where: {
   guildid: member.guild.id,
   userid: member.user.id,
  },
 });

 if (!res.length) return;

 res.forEach(async (data) => {
  ch.DataBase.punish_tempmutes.delete({ where: { uniquetimestamp: data.uniquetimestamp } }).then();
  ch.DataBase.punish_mutes.create({ data }).then();
 });
};
