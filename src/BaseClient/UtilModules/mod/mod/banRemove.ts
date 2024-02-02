import type * as CT from '../../../../Typings/Typings.js';
import type * as ModTypes from '../../mod.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.BanRemove>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = options.guild.client.util.CT.ModTypes.BanRemove;

 options.guild.client.util.cache.bans.delete(options.guild.id, options.target.id);

 const me = await options.guild.client.util.getBotMemberFromGuild(options.guild);
 if (
  !options.guild.client.util.importCache.BaseClient.UtilModules.requestHandler.guilds.unbanUser.file.canUnbanUser(
   me,
  ) &&
  !options.skipChecks
 ) {
  options.guild.client.util.mod.permissionError(cmd, message, language, type);
  return false;
 }

 const existingBan = await options.guild.client.util.request.guilds.getMemberBan(
  options.guild,
  options.target.id,
 );
 if ('message' in existingBan && !options.skipChecks) {
  options.guild.client.util.mod.actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const res = await options.guild.client.util.request.guilds.unbanUser(
  options.guild,
  options.target.id,
  options.reason,
 );
 if (res && 'message' in res) {
  options.guild.client.util.mod.err(cmd, res, language, message, options.guild);
  return false;
 }

 return true;
};
