import * as Discord from 'discord.js';
import { canDeleteRole } from '../../../BaseClient/UtilModules/requestHandler/guilds/deleteRole.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.delete;

 const roleId = args.shift() as string;
 const role = cmd.guild.roles.cache.get(roleId);
 if (!role) {
  cmd.client.util.errorCmd(cmd, language.errors.roleNotFound, language);
  return;
 }

 const me = await cmd.client.util.getBotMemberFromGuild(cmd.guild);
 const canDelete = me ? canDeleteRole(me, role.id) : false;
 if (!canDelete) {
  cmd.client.util.errorCmd(cmd, language.errors.roleNotManageable, language);
  return;
 }

 const m = canDelete ? await cmd.update({ content: lan.deleted(role), components: [] }) : undefined;

 const res = await cmd.client.util.request.guilds.deleteRole(cmd.guild, role.id);
 if (typeof res !== 'undefined') cmd.client.util.errorCmd(cmd, res, language, m);
};
