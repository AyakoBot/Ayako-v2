import * as CT from '../../../../Typings/CustomTypings.js';

import DataBase from '../../../DataBase.js';

import { request } from '../../requestHandler.js';
import type * as ModTypes from '../../mod.js';
import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import cache from '../../cache.js';
import isModeratable from '../../isModeratable.js';

import actionAlreadyApplied from '../actionAlreadyApplied.js';
import permissionError from '../permissionError.js';
import getMembers from '../getMembers.js';
import err from '../err.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.MuteRemove>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = CT.ModTypes.MuteRemove;

 cache.mutes.delete(options.guild.id, options.target.id);

 const memberResponse = await getMembers(cmd, options, language, message, type);
 if (!memberResponse) {
  const punishments = await DataBase.punish_tempmutes.findMany({
   where: { userid: options.target.id, guildid: options.guild.id },
  });

  const runningPunishment = punishments?.find(
   (p) => Number(p.uniquetimestamp) + Number(p.duration) * 1000 > Date.now(),
  );

  if (!runningPunishment && !options.skipChecks) {
   actionAlreadyApplied(cmd, message, options.target, language, type);
   return false;
  }
  return true;
 }
 const { targetMember } = memberResponse;

 const me = await getBotMemberFromGuild(options.guild);
 if (!isModeratable(me, targetMember) && !options.skipChecks) {
  permissionError(cmd, message, language, type);
  return false;
 }

 if (!targetMember.isCommunicationDisabled() && !options.skipChecks) {
  actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const res = await request.guilds.editMember(targetMember, {
  communication_disabled_until: null,
 });

 if ('message' in res) {
  err(cmd, res, language, message, options.guild);
  return false;
 }

 return true;
};
