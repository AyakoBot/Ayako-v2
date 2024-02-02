import * as Discord from 'discord.js';
import type * as CT from '../../../../Typings/Typings.js';

import type * as ModTypes from '../../mod.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.KickAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = options.guild.client.util.CT.ModTypes.KickAdd;

 const memberRes = await options.guild.client.util.mod.getMembers(
  cmd,
  options,
  language,
  message,
  type,
 );
 if (memberRes && !memberRes.canExecute) return false;

 if (!memberRes?.targetMember && !options.skipChecks) {
  options.guild.client.util.mod.actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 // TODO: Debug this in Cozy using 564052925828038658
 const me = await options.guild.client.util.getBotMemberFromGuild(options.guild);
 if (
  memberRes?.targetMember &&
  options.guild.client.util.importCache.BaseClient.UtilModules.requestHandler.guilds.removeMember.file.canRemoveMember(
   me,
   memberRes.targetMember,
  ) &&
  !options.skipChecks
 ) {
  options.guild.client.util.mod.permissionError(cmd, message, language, type);
  return false;
 }

 const res = memberRes?.targetMember
  ? await options.guild.client.util.request.guilds.removeMember(
     memberRes.targetMember,
     options.reason,
    )
  : false;
 if (res && (res as Discord.DiscordAPIError).message) {
  options.guild.client.util.mod.err(
   cmd,
   res as Discord.DiscordAPIError,
   language,
   message,
   options.guild,
  );
  return false;
 }

 return true;
};
