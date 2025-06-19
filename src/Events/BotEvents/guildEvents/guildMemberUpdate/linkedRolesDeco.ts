import type { GuildMember, Role } from 'discord.js';
import { revokeToken } from '../../../../Commands/SlashCommands/settings/roles/linked-roles-deco.js';
import linkedRolesDeco from './linkedRolesDeco.js';

export default async (
 member: GuildMember,
 roleOverwrite: Role[] | null = null,
 verificationRun: boolean = false,
) => {
 const settings = await member.client.util.DataBase.linkedRolesDeco.findMany({
  where: { guildid: member.guild.id },
 });
 if (!settings) return;

 const notQualified = settings.filter(
  (s) =>
   !(roleOverwrite || member.roles.cache).some((r) => s.allowedRoles.includes(r.id)) &&
   !s.allowedUsers.includes(member.id),
 );
 if (!notQualified.length) return;

 const tokens = await member.client.util.DataBase.linkedRoleTokens
  .findMany({
   where: { botId: { in: notQualified.map((s) => s.botId || '') }, userId: member.id },
  })
  .then((r) => r.map((t) => ({ ...t, settings: notQualified.find((s) => s.botId === t.botId) })));
 if (!tokens.length) return;

 if (!verificationRun) {
  const fetched = await member.client.util.request.guilds.getMember(member.guild, member.id);

  if (!fetched || 'message' in fetched) {
   linkedRolesDeco(member, [], true);
   return;
  }

  linkedRolesDeco(fetched, roleOverwrite, true);
  return;
 }

 tokens
  .filter((t) => !!t.settings?.botSecret)
  .forEach((t) =>
   revokeToken(member.guild, t.userId, { id: t.botId, secret: t.settings?.botSecret! }),
  );
};
