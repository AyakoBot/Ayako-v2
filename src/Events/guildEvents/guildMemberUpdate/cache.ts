import * as Discord from 'discord.js';

export default async (oldMember: Discord.GuildMember, member: Discord.GuildMember) => {
 if (!oldMember.isCommunicationDisabled()) return;
 if (member.isCommunicationDisabled()) return;

 const res = await member.client.util.DataBase.punish_tempmutes.findMany({
  where: {
   guildid: member.guild.id,
   userid: member.user.id,
  },
 });

 if (!res.length) return;

 res.forEach(async (data) => {
  member.client.util.DataBase.punish_tempmutes
   .delete({ where: { uniquetimestamp: data.uniquetimestamp } })
   .then();
  member.client.util.DataBase.punish_mutes.create({ data }).then();
 });
};
