import type * as CT from '../../../../Typings/Typings.js';
import type * as ModTypes from '../../mod.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.MuteRemove>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = options.guild.client.util.CT.ModTypes.MuteRemove;

 options.guild.client.util.cache.mutes.delete(options.guild.id, options.target.id);

 const memberRes = await options.guild.client.util.mod.getMembers(
  cmd,
  options,
  language,
  message,
  type,
 );
 if (memberRes && !memberRes.canExecute) return false;

 if (!memberRes) {
  const punishments = await options.guild.client.util.DataBase.punish_tempmutes.findMany({
   where: { userid: options.target.id, guildid: options.guild.id },
  });

  const runningPunishment = punishments?.find(
   (p) => Number(p.uniquetimestamp) + Number(p.duration) * 1000 > Date.now(),
  );

  if (!runningPunishment && !options.skipChecks) {
   options.guild.client.util.mod.actionAlreadyApplied(cmd, message, options.target, language, type);
   return false;
  }
  return true;
 }
 const { targetMember } = memberRes;

 const me = await options.guild.client.util.getBotMemberFromGuild(options.guild);
 if (
  !options.skipChecks &&
  !options.guild.client.util.importCache.BaseClient.UtilModules.requestHandler.guilds.editMember.file.canEditMember(
   me,
   targetMember,
   { communication_disabled_until: '1' },
  )
 ) {
  options.guild.client.util.mod.permissionError(cmd, message, language, type);
  return false;
 }

 if (!targetMember.isCommunicationDisabled() && !options.skipChecks) {
  options.guild.client.util.mod.actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const res = await options.guild.client.util.request.guilds.editMember(targetMember, {
  communication_disabled_until: null,
 });

 if ('message' in res) {
  options.guild.client.util.mod.err(cmd, res, language, message, options.guild);
  return false;
 }

 return true;
};
