import * as Discord from 'discord.js';
import { scheduleJob } from 'node-schedule';
import * as CT from '../../../../Typings/Typings.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import type * as ModTypes from '../../mod.js';
import { request } from '../../requestHandler.js';

import cache from '../../cache.js';
import getPathFromError from '../../getPathFromError.js';
import { canEditMember } from '../../requestHandler/guilds/editMember.js';
import actionAlreadyApplied from '../actionAlreadyApplied.js';
import err from '../err.js';
import getMembers from '../getMembers.js';
import permissionError from '../permissionError.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.VcTempMuteAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = CT.ModTypes.VcTempMuteAdd;

 const memberRes = await getMembers(cmd, options, language, message, type);
 if (memberRes && !memberRes.canExecute) return false;

 if (
  !options.skipChecks &&
  (!memberRes?.targetMember ||
   !memberRes.targetMember.voice.channelId ||
   memberRes.targetMember.voice.mute)
 ) {
  actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const me = await getBotMemberFromGuild(options.guild);
 if (
  memberRes?.targetMember &&
  !canEditMember(me, memberRes.targetMember, { mute: true }) &&
  !options.skipChecks
 ) {
  permissionError(cmd, message, language, type);
  return false;
 }

 const res = memberRes?.targetMember
  ? await request.guilds.editMember(memberRes.targetMember, { mute: true }, options.reason)
  : false;
 if (res && (res as Discord.DiscordAPIError).message) {
  err(cmd, res as Discord.DiscordAPIError, language, message, options.guild);
  return false;
 }

 cache.vcMutes.set(
  scheduleJob(
   getPathFromError(new Error()),
   new Date(Date.now() + options.duration * 1000),
   async () => {
    options.guild.client.util.mod(undefined, CT.ModTypes.VcMuteRemove, {
     dbOnly: false,
     executor: (await getBotMemberFromGuild(options.guild)).user,
     guild: options.guild,
     reason: language.mod.execution.vcMuteRemove.reason,
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
