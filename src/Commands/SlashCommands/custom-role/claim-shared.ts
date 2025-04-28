import type { ChatInputCommandInteraction } from 'discord.js';

export default async (cmd: ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const [roleId, userId] = cmd.options.getString('role', true).split('-');
 const role = cmd.guild.roles.cache.get(roleId);
 const language = await cmd.client.util.getLanguage(cmd.locale);
 const lan = language.slashCommands.roles.customRole.share;

 console.log(roleId)
 if (!role) {
  await cmd.reply({ content: lan.notFound, ephemeral: true });
  return;
 }

 const settings = await cmd.client.util.DataBase.customroles.findFirst({
  where: { guildid: cmd.guild.id, roleid: roleId, userid: userId, shared: { has: cmd.user.id } },
 });

 if (!settings) {
  await cmd.reply({ content: lan.notAllowed, ephemeral: true });
  return;
 }

 cmd.client.util.roleManager.add(cmd.member, [role.id], language.autotypes.customroles);
 cmd.client.util.replyCmd(cmd, { content: lan.claimed(role), ephemeral: true });
};
