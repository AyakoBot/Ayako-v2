import * as Jobs from 'node-schedule';
import type * as CT from '../../../../Typings/Typings.js';
import type * as ModTypes from '../../mod.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.TempMuteAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = options.guild.client.util.CT.ModTypes.TempMuteAdd;

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

  if (runningPunishment && !options.skipChecks) {
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

 if (targetMember.isCommunicationDisabled() && !options.skipChecks) {
  options.guild.client.util.mod.actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const res = await options.guild.client.util.request.guilds.editMember(
  targetMember,
  {
   communication_disabled_until: new Date(
    Date.now() + (options.duration > 2419200 ? 2419200000 : options.duration * 1000),
   ).toISOString(),
  },
  options.reason,
 );

 if ('message' in res) {
  options.guild.client.util.mod.err(cmd, res, language, message, options.guild);
  return false;
 }

 options.guild.client.util.cache.mutes.set(
  Jobs.scheduleJob(
   new Date(Date.now() + (options.duration > 2419200 ? 2419200000 : options.duration * 1000)),
   async () => {
    options.guild.client.util.mod.file(
     undefined,
     options.guild.client.util.CT.ModTypes.MuteRemove,
     {
      dbOnly: false,
      executor: (await options.guild.client.util.getBotMemberFromGuild(options.guild)).user,
      guild: options.guild,
      reason: language.mod.execution.muteRemove.reason,
      target: options.target,
      skipChecks: true,
     },
    );
   },
  ),
  options.guild.id,
  options.target.id,
 );

 return true;
};
