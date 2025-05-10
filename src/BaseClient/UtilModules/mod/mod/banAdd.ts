import * as CT from '../../../../Typings/Typings.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import type * as ModTypes from '../../mod.js';
import { request } from '../../requestHandler.js';

import actionAlreadyApplied from '../actionAlreadyApplied.js';
import err from '../err.js';
import getMembers from '../getMembers.js';
import permissionError from '../permissionError.js';
import { canBanMember } from '../../requestHandler/guilds/banMember.js';
import { canBanUser } from '../../requestHandler/guilds/banUser.js';
import rmVotePunish from '../rmVotePunish.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.BanAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = CT.ModTypes.BanAdd;

 const memberRes = await getMembers(cmd, options, language, message, type);
 if (memberRes && !memberRes.canExecute) return false;

 rmVotePunish(options, memberRes?.executorMember, cmd?.channelId);

 const me = await getBotMemberFromGuild(options.guild);
 if (
  !options.skipChecks &&
  ((memberRes && !canBanMember(me, memberRes.targetMember)) || !canBanUser(me))
 ) {
  permissionError(cmd, message, language, type);
  return false;
 }

 const existingBan = await request.guilds.getMemberBan(options.guild, options.target.id);
 if (!('message' in existingBan) && !options.skipChecks) {
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
