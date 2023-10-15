import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (member: Discord.GuildMember) => {
 const settings = await ch.DataBase.sticky.findUnique({
  where: { guildid: member.guild.id, stickyrolesactive: true },
 });
 if (!settings) return;

 const sticky = await ch.DataBase.stickyrolemembers.delete({
  where: { userid_guildid: { userid: member.id, guildid: member.guild.id } },
  select: { userid: true, guildid: true, roles: true },
 });
 if (!sticky) return;

 const me = await ch.getBotMemberFromGuild(member.guild);

 const manageableRoles = sticky.roles
  .map((r) => member.guild.roles.cache.get(r))
  .filter((r): r is Discord.Role => !!r)
  .filter((r) => Number(me?.roles.highest.position) > r.position)
  .filter((r) => !r.managed);

 const rolesToAdd = settings.stickyrolesmode
  ? manageableRoles.filter((r) => !settings.roles.includes(r.id))
  : manageableRoles.filter((r) => settings.roles.includes(r.id));

 ch.request.guilds.editMember(member.guild, member.id, {
  roles: rolesToAdd.map((r) => r.id),
 });
};
