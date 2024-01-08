import * as Discord from 'discord.js';

export default async (member: Discord.GuildMember) => {
 const customRole = await member.client.util.DataBase.customroles.delete({
  where: { guildid_userid: { guildid: member.guild.id, userid: member.id } },
  select: { roleid: true },
 });

 if (!customRole) return;

 const language = await member.client.util.getLanguage(member.guild.id);
 member.client.util.request.guilds.deleteRole(
  member.guild,
  customRole.roleid,
  language.events.guildMemberUpdate.rewards.memberLeft,
 );
};
