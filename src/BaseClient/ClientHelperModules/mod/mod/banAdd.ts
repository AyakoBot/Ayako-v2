import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import isModeratable from '../../isModeratable.js';
import type * as ModTypes from '../../mod.js';
import { request } from '../../requestHandler.js';

import actionAlreadyApplied from '../actionAlreadyApplied.js';
import err from '../err.js';
import getMembers from '../getMembers.js';
import permissionError from '../permissionError.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.BanAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = CT.ModTypes.BanAdd;

 const memberRes = await getMembers(cmd, options, language, message, type);
 const me = await getBotMemberFromGuild(options.guild);
 if (
  ((memberRes && !isModeratable(me, memberRes.targetMember)) ||
   !me.permissions.has(Discord.PermissionFlagsBits.BanMembers)) &&
  !options.skipChecks
 ) {
  permissionError(cmd, message, language, type);
  return false;
 }

 if (options.guild.bans.cache.has(options.target.id) && !options.skipChecks) {
  actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const res = await (memberRes
  ? request.guilds.banMember(
     memberRes.targetMember,
     { delete_message_seconds: options.deleteMessageSeconds },
     options.reason,
    )
  : request.guilds.banUser(
     options.guild,
     options.target.id,
     { delete_message_seconds: options.deleteMessageSeconds },
     options.reason,
    ));

 if (typeof res !== 'undefined' && 'message' in res) {
  err(cmd, res, language, message, options.guild);
  return false;
 }

 return true;
};
