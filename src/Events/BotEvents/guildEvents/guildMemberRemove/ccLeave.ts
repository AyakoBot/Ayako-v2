import { GuildMember } from 'discord.js';

export default async (member: GuildMember) => {
 if (!member.user.bot) return;

 const cc = await member.client.util.DataBase.customclients.findUnique({
  where: { guildid: member.guild.id, appid: member.id },
 });
 if (!cc) return;

 member.client.util.cache.apis.delete(member.guild.id);
};
