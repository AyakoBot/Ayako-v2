import * as Jobs from 'node-schedule';
import * as CT from '../../../../Typings/Typings.js';

import DataBase from '../../../DataBase.js';

import cache from '../../cache.js';
import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import type * as ModTypes from '../../mod.js';
import { request } from '../../requestHandler.js';

import actionAlreadyApplied from '../actionAlreadyApplied.js';
import err from '../err.js';
import getMembers from '../getMembers.js';
import permissionError from '../permissionError.js';
import { canEditMember } from '../../requestHandler/guilds/editMember.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.TempMuteAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = CT.ModTypes.TempMuteAdd;

 const memberRes = await getMembers(cmd, options, language, message, type);
 if (memberRes && !memberRes.canExecute) return false;

 if (!memberRes) {
  const punishments = await DataBase.punish_tempmutes.findMany({
   where: { userid: options.target.id, guildid: options.guild.id },
  });

  const runningPunishment = punishments?.find(
   (p) => Number(p.uniquetimestamp) + Number(p.duration) * 1000 > Date.now(),
  );

  if (runningPunishment && !options.skipChecks) {
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

 if (targetMember.isCommunicationDisabled() && !options.skipChecks) {
  actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const res = await request.guilds.editMember(
  targetMember,
  {
   communication_disabled_until: new Date(
    Date.now() + (options.duration > 2419200 ? 2419200000 : options.duration * 1000),
   ).toISOString(),
  },
  options.reason,
 );

 if ('message' in res) {
  err(cmd, res, language, message, options.guild);
  return false;
 }

 cache.mutes.set(
  Jobs.scheduleJob(
   new Date(Date.now() + (options.duration > 2419200 ? 2419200000 : options.duration * 1000)),
   async () => {
    const m: typeof ModTypes = await import(
     `${process.cwd()}${
      process.cwd().includes('dist') ? '' : '/dist'
     }/BaseClient/ClientHelperModules/mod.js`
    );
    m.default(undefined, CT.ModTypes.MuteRemove, {
     dbOnly: false,
     executor: (await getBotMemberFromGuild(options.guild)).user,
     guild: options.guild,
     reason: language.mod.execution.muteRemove.reason,
     target: options.target,
     skipChecks: true,
    });
   },
  ),
  options.guild.id,
  options.target.id,
 );

 return true;
};
