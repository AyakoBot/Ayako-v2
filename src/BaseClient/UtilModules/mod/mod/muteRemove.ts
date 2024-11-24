import { StoredPunishmentTypes } from '@prisma/client';
import * as CT from '../../../../Typings/Typings.js';
import DataBase from '../../../Bot/DataBase.js';

import cache from '../../cache.js';
import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import type * as ModTypes from '../../mod.js';
import { request } from '../../requestHandler.js';
import { canEditMember } from '../../requestHandler/guilds/editMember.js';

import actionAlreadyApplied from '../actionAlreadyApplied.js';
import err from '../err.js';
import getMembers from '../getMembers.js';
import permissionError from '../permissionError.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.MuteRemove>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = CT.ModTypes.MuteRemove;

 cache.mutes.delete(options.guild.id, options.target.id);

 const memberRes = await getMembers(cmd, options, language, message, type);
 if (memberRes && !memberRes.canExecute) return false;

 if (!memberRes) {
  const punishments = await DataBase.punishments.findMany({
   where: {
    userid: options.target.id,
    guildid: options.guild.id,
    type: StoredPunishmentTypes.tempmute,
   },
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
 const { targetMember } = memberRes;

 const me = await getBotMemberFromGuild(options.guild);
 if (
  !options.skipChecks &&
  !canEditMember(me, targetMember, { communication_disabled_until: '1' })
 ) {
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
