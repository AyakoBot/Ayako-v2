import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const role = cmd.options.getRole('role', true);
 const user = cmd.options.getUser('user', true);
 const member = await cmd.guild?.members.fetch(user).catch(() => undefined);

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.roles.give;

 if (!role.editable) {
  ch.errorCmd(cmd, language.errors.roleNotManageable, language);
  return;
 }

 if (!member) {
  ch.errorCmd(cmd, language.errors.memberNotFound, language);
  return;
 }

 if (!ch.isManageable(member, cmd.member)) {
  ch.errorCmd(cmd, language.errors.cantManage, language);
  return;
 }

 if (role.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
  ch.errorCmd(cmd, lan.administrator, language);
  return;
 }

 if (member.roles.cache.has(role.id)) {
  ch.errorCmd(cmd, lan.alreadyHas(role, user), language);
  return;
 }

 let error: Error | null = null;
 await member.roles.add(role).catch((e) => {
  error = e;
 });

 if (error) ch.errorCmd(cmd, (error as Error).message, language);
 else ch.replyCmd(cmd, { content: lan.given(role, user) });
};
