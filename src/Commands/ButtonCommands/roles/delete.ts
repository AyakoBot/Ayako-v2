import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.roles.delete;

 const roleId = args.shift() as string;
 const role = cmd.guild.roles.cache.get(roleId);
 if (!role) {
  ch.errorCmd(cmd, language.errors.roleNotFound, language);
  return;
 }

 let error: Error | null = null;
 await role.delete().catch((e) => {
  error = e;
 });

 if (error) ch.errorCmd(cmd, (error as Error).message, language);
 else cmd.update({ content: lan.deleted(role as Discord.Role) });
};
