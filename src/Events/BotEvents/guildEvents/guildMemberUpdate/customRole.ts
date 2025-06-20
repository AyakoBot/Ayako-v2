import type { GuildMember } from 'discord.js';

export default async (member: GuildMember) => {
 const customRoles = await member.client.util.DataBase.customroles.findMany({
  where: { roleid: { in: member.roles.cache.map((r) => r.id) } },
 });
 if (!customRoles.length) return;

 const notQualified = customRoles.filter(
  (r) => r.userid !== member.id && !r.shared.includes(member.id),
 );
 if (!notQualified.length) return;

 const language = await member.client.util.getLanguage(member.guild.id);
 member.client.util.roleManager.remove(member, notQualified.map((r) => r.roleid), language.autotypes.customroles);
};
