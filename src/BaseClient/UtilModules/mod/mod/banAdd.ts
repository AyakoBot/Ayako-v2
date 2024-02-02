import type * as CT from '../../../../Typings/Typings.js';
import type * as ModTypes from '../../mod.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.BanAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = options.guild.client.util.CT.ModTypes.BanAdd;

 const memberRes =
  await options.guild.client.util.importCache.BaseClient.UtilModules.mod.getMembers.file.default(
   cmd,
   options,
   language,
   message,
   type,
  );
 if (memberRes && !memberRes.canExecute) return false;

 const me = await options.guild.client.util.getBotMemberFromGuild(options.guild);
 if (
  !options.skipChecks &&
  ((memberRes &&
   !options.guild.client.util.importCache.BaseClient.UtilModules.requestHandler.guilds.banMember.file.canBanMember(
    me,
    memberRes.targetMember,
   )) ||
   !options.guild.client.util.importCache.BaseClient.UtilModules.requestHandler.guilds.banUser.file.canBanUser(
    me,
   ))
 ) {
  options.guild.client.util.mod.permissionError(cmd, message, language, type);
  return false;
 }

 const existingBan = await options.guild.client.util.request.guilds.getMemberBan(
  options.guild,
  options.target.id,
 );
 if (!('message' in existingBan) && !options.skipChecks) {
  options.guild.client.util.mod.actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const res = await (memberRes
  ? options.guild.client.util.request.guilds.banMember(
     memberRes.targetMember,
     { delete_message_seconds: options.deleteMessageSeconds },
     options.reason,
    )
  : options.guild.client.util.request.guilds.banUser(
     options.guild,
     options.target.id,
     { delete_message_seconds: options.deleteMessageSeconds },
     options.reason,
    ));

 if (typeof res !== 'undefined' && 'message' in res) {
  options.guild.client.util.mod.err(cmd, res, language, message, options.guild);
  return false;
 }

 return true;
};
