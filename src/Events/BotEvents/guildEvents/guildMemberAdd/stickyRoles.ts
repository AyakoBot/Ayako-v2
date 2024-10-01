import * as Discord from 'discord.js';

export default async (member: Discord.GuildMember) => {
 const settings = await member.client.util.DataBase.sticky.findUnique({
  where: { guildid: member.guild.id, stickyrolesactive: true },
 });
 if (!settings) return;

 const sticky = await member.client.util.DataBase.stickyrolemembers.delete({
  where: { userid_guildid: { userid: member.id, guildid: member.guild.id } },
  select: { userid: true, guildid: true, roles: true },
 });
 if (!sticky) return;

 const me = await member.client.util.getBotMemberFromGuild(member.guild);

 const manageableRoles = sticky.roles
  .map((r) => member.guild.roles.cache.get(r))
  .filter((r): r is Discord.Role => !!r)
  .filter((r) => Number(me?.roles.highest.position) > r.position)
  .filter((r) => !r.managed);

 const rolesToAdd = settings.stickyrolesmode
  ? manageableRoles.filter((r) => !settings.roles.includes(r.id))
  : manageableRoles.filter((r) => settings.roles.includes(r.id));

 const newRoles = [
  ...new Set([...rolesToAdd.map((r) => r.id), ...member.roles.cache.map((r) => r.id)]),
 ];

 if (newRoles.every((r) => member.roles.cache.has(r))) return;

 const language = await member.client.util.getLanguage(member.guild.id);

 member.client.util.request.guilds.editMember(
  member,
  { roles: newRoles },
  language.autotypes.stickyroles,
 );
};
