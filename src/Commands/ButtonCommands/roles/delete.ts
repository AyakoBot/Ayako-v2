import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { canDeleteRole } from '../../../BaseClient/ClientHelperModules/requestHandler/guilds/deleteRole.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.delete;

 const roleId = args.shift() as string;
 const role = cmd.guild.roles.cache.get(roleId);
 if (!role) {
  ch.errorCmd(cmd, language.errors.roleNotFound, language);
  return;
 }

 const me = await ch.getBotMemberFromGuild(cmd.guild);
 const canDelete = me ? canDeleteRole(me, role.id) : false;
 if (!canDelete) {
  ch.errorCmd(cmd, language.errors.roleNotManageable, language);
  return;
 }

 const m = canDelete ? await cmd.update({ content: lan.deleted(role), components: [] }) : undefined;

 const res = await ch.request.guilds.deleteRole(cmd.guild, role.id);
 if (typeof res !== 'undefined') ch.errorCmd(cmd, res, language, m);
};
