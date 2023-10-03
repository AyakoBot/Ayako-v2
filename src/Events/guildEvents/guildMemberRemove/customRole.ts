import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (member: Discord.GuildMember) => {
 const customRole = await ch.DataBase.customroles.delete({
  where: { guildid_userid: { guildid: member.guild.id, userid: member.id } },
  select: { roleid: true },
 });

 if (!customRole) return;

 const language = await ch.getLanguage(member.guild.id);
 ch.request.guilds.deleteRole(
  member.guild,
  customRole.roleid,
  language.events.guildMemberUpdate.rewards.memberLeft,
 );
};
