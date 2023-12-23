import * as CT from '../../../../Typings/Typings.js';
import DataBase from '../../../DataBase.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import isManageable from '../../isManageable.js';
import type * as ModTypes from '../../mod.js';
import roleManager from '../../roleManager.js';

import actionAlreadyApplied from '../actionAlreadyApplied.js';
import getMembers from '../getMembers.js';
import permissionError from '../permissionError.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.RoleAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = CT.ModTypes.RoleAdd;

 const memberResponse = await getMembers(cmd, options, language, message, type);
 if (!memberResponse) {
  const sticky = await DataBase.sticky.findUnique({ where: { guildid: options.guild.id } });
  if (!sticky?.stickyrolesactive) return false;

  const roles = sticky.stickyrolesmode
   ? options.roles.filter((r) => !sticky.roles.includes(r.id))
   : options.roles.filter((r) => sticky.roles.includes(r.id));
  if (!roles.length) return false;

  const stickyRoleSetting = await DataBase.stickyrolemembers.findUnique({
   where: { userid_guildid: { userid: options.target.id, guildid: options.guild.id } },
  });

  if (
   stickyRoleSetting?.roles.filter((r) => roles.find((r1) => r1.id === r)).length &&
   !options.skipChecks
  ) {
   actionAlreadyApplied(cmd, message, options.target, language, type);
   return false;
  }

  DataBase.stickyrolemembers
   .upsert({
    where: { userid_guildid: { userid: options.target.id, guildid: options.guild.id } },
    create: {
     userid: options.target.id,
     guildid: options.guild.id,
     roles: roles.map((r) => r.id),
    },
    update: {
     roles: [...(stickyRoleSetting?.roles ?? []), ...roles.map((r) => r.id)],
    },
   })
   .then();

  return true;
 }
 const { targetMember } = memberResponse;

 if (targetMember.roles.cache.hasAll(...options.roles.map((r) => r.id)) && !options.skipChecks) {
  actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const me = await getBotMemberFromGuild(options.guild);
 options.roles = options.roles.filter((r) => r.position < Number(me.roles.highest.position));

 if ((!isManageable(targetMember, me) || !options.roles.length) && !options.skipChecks) {
  permissionError(cmd, message, language, type);
  return false;
 }

 await roleManager.add(
  targetMember,
  options.roles.map((r) => r.id),
  options.reason,
  1,
 );

 return true;
};
