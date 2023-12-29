import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import type * as ModTypes from '../../mod.js';
import { request } from '../../requestHandler.js';

import actionAlreadyApplied from '../actionAlreadyApplied.js';
import getMembers from '../getMembers.js';
import err from '../err.js';
import permissionError from '../permissionError.js';
import { canRemoveMember } from '../../requestHandler/guilds/removeMember.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.KickAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = CT.ModTypes.KickAdd;

 const memberRes = await getMembers(cmd, options, language, message, type);
 if (memberRes && !memberRes.canExecute) return false;

 if (!memberRes?.targetMember && !options.skipChecks) {
  actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const me = await getBotMemberFromGuild(options.guild);
 if (
  memberRes?.targetMember &&
  canRemoveMember(me, memberRes.targetMember) &&
  !options.skipChecks
 ) {
  permissionError(cmd, message, language, type);
  return false;
 }

 const res = memberRes?.targetMember
  ? await request.guilds.removeMember(memberRes.targetMember, options.reason)
  : false;
 if (res && (res as Discord.DiscordAPIError).message) {
  err(cmd, res as Discord.DiscordAPIError, language, message, options.guild);
  return false;
 }

 return true;
};
