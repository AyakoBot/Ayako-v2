import type * as CT from '../../../../Typings/Typings.js';
import type * as ModTypes from '../../mod.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.RoleRemove>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = options.guild.client.util.CT.ModTypes.RoleRemove;

 const memberRes = await options.guild.client.util.mod.getMembers(
  cmd,
  options,
  language,
  message,
  type,
 );
 if (memberRes && !memberRes.canExecute) return false;

 if (!memberRes) {
  const sticky = await options.guild.client.util.DataBase.sticky.findUnique({
   where: { guildid: options.guild.id },
  });
  if (!sticky?.stickyrolesactive) return true;

  const roles = sticky.stickyrolesmode
   ? options.roles.filter((r) => !sticky.roles.includes(r.id))
   : options.roles.filter((r) => sticky.roles.includes(r.id));
  if (!roles.length) return true;

  const stickyRoleSetting = await options.guild.client.util.DataBase.stickyrolemembers.findUnique({
   where: { userid_guildid: { userid: options.target.id, guildid: options.guild.id } },
  });
  if (!stickyRoleSetting) return true;

  if (
   !stickyRoleSetting.roles.filter((r) => roles.find((r1) => r1.id === r)).length &&
   !options.skipChecks
  ) {
   options.guild.client.util.mod.actionAlreadyApplied(cmd, message, options.target, language, type);
   return false;
  }

  const newRoles = stickyRoleSetting?.roles.filter((r) => !roles.find((r1) => r1.id === r)) ?? [];

  if (!newRoles.length) {
   options.guild.client.util.DataBase.stickyrolemembers
    .delete({
     where: { userid_guildid: { userid: options.target.id, guildid: options.guild.id } },
    })
    .then();
   return true;
  }

  options.guild.client.util.DataBase.stickyrolemembers
   .update({
    where: { userid_guildid: { userid: options.target.id, guildid: options.guild.id } },
    data: {
     roles: newRoles,
    },
   })
   .then();

  return true;
 }

 const { targetMember } = memberRes;

 if (!targetMember.roles.cache.hasAny(...options.roles.map((r) => r.id)) && !options.skipChecks) {
  options.guild.client.util.mod.actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const me = await options.guild.client.util.getBotMemberFromGuild(options.guild);
 options.roles = options.roles.filter((r) => r.position < Number(me.roles.highest.position));
 if (
  (options.roles
   .map((r) =>
    options.guild.client.util.importCache.BaseClient.UtilModules.requestHandler.guilds.removeRoleFromMember.file.canRemoveRoleFromMember(
     me,
     r.id,
    ),
   )
   .find((can) => !can) ||
   !options.roles.length) &&
  !options.skipChecks
 ) {
  options.guild.client.util.mod.permissionError(cmd, message, language, type);
  return false;
 }

 await options.guild.client.util.roleManager.remove(
  targetMember,
  options.roles.map((r) => r.id),
  options.reason,
  1,
 );

 return true;
};
