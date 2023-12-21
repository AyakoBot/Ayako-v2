import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/CustomTypings.js';

import DataBase from '../../../DataBase.js';

import type * as ModTypes from '../../mod.js';
import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import roleManager from '../../roleManager.js';
import isManageable from '../../isManageable.js';

import actionAlreadyApplied from '../actionAlreadyApplied.js';
import getMembers from '../getMembers.js';
import permissionError from '../permissionError.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.RoleRemove>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = CT.ModTypes.RoleRemove;

 const memberResponse = await getMembers(cmd, options, language, message, type);
 if (!memberResponse) {
  const sticky = await DataBase.sticky.findUnique({ where: { guildid: options.guild.id } });
  if (!sticky?.stickyrolesactive) return true;

  const roles = sticky.stickyrolesmode
   ? options.roles.filter((r) => !sticky.roles.includes(r.id))
   : options.roles.filter((r) => sticky.roles.includes(r.id));
  if (!roles.length) return true;

  const stickyRoleSetting = await DataBase.stickyrolemembers.findUnique({
   where: { userid_guildid: { userid: options.target.id, guildid: options.guild.id } },
  });
  if (!stickyRoleSetting) return true;

  if (
   !stickyRoleSetting.roles.filter((r) => roles.find((r1) => r1.id === r)).length &&
   !options.skipChecks
  ) {
   actionAlreadyApplied(cmd, message, options.target, language, type);
   return false;
  }

  const newRoles = stickyRoleSetting?.roles.filter((r) => !roles.find((r1) => r1.id === r)) ?? [];

  if (!newRoles.length) {
   DataBase.stickyrolemembers
    .delete({
     where: { userid_guildid: { userid: options.target.id, guildid: options.guild.id } },
    })
    .then();
   return true;
  }

  DataBase.stickyrolemembers
   .update({
    where: { userid_guildid: { userid: options.target.id, guildid: options.guild.id } },
    data: {
     roles: newRoles,
    },
   })
   .then();

  return true;
 }

 const { targetMember } = memberResponse;

 if (!targetMember.roles.cache.hasAny(...options.roles.map((r) => r.id)) && !options.skipChecks) {
  actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const me = await getBotMemberFromGuild(options.guild);
 options.roles = options.roles.filter((r) => r.position < Number(me.roles.highest.position));

 if (
  (!me.permissions.has(Discord.PermissionFlagsBits.ManageRoles) ||
   !isManageable(targetMember, me) ||
   !options.roles.length) &&
  !options.skipChecks
 ) {
  permissionError(cmd, message, language, type);
  return false;
 }

 await roleManager.remove(
  targetMember,
  options.roles.map((r) => r.id),
  options.reason,
  1,
 );

 return true;
};
