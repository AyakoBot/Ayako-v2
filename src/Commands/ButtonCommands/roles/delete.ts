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

 const res = await ch.request.guilds.deleteRole(cmd.guild, role.id);
 if (typeof res !== 'undefined') ch.errorCmd(cmd, res.message, language);
 else cmd.update({ content: lan.deleted(role as Discord.Role) });
};
