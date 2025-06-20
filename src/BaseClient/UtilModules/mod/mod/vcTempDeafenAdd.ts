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
import rmVotePunish from '../rmVotePunish.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.VcTempDeafenAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = CT.ModTypes.VcTempDeafenAdd;

 const memberRes = await getMembers(cmd, options, language, message, type);
 if (memberRes && !memberRes.canExecute) return false;

 rmVotePunish(options, memberRes?.executorMember, cmd?.channelId);

 if (!options.skipChecks && (!memberRes?.targetMember || memberRes.targetMember.voice.deaf)) {
  actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const me = await getBotMemberFromGuild(options.guild);
 if (
  memberRes?.targetMember &&
  memberRes.targetMember.voice.channelId &&
  !canEditMember(me, memberRes.targetMember, { deaf: true }) &&
  !options.skipChecks
 ) {
  permissionError(cmd, message, language, type);
  return false;
 }

 if (!memberRes?.targetMember.voice.channelId) {
  await options.guild.client.util.DataBase.voiceStateUpdateQueue.upsert({
   where: { userId_guildId: { guildId: options.guild.id, userId: options.target.id } },
   update: { deaf: true },
   create: {
    guildId: options.guild.id,
    userId: options.target.id,
    deaf: true,
    mute: false,
   },
  });

  return true;
 }

 const res = memberRes?.targetMember
  ? await request.guilds.editMember(memberRes.targetMember, { deaf: true }, options.reason)
  : false;
 if (res && (res as Discord.DiscordAPIError).message) {
  err(cmd, res as Discord.DiscordAPIError, language, message, options.guild);
  return false;
 }

 cache.vcDeafens.set(
  scheduleJob(
   getPathFromError(new Error()),
   new Date(Date.now() + options.duration * 1000),
   async () => {
    options.guild.client.util.mod(undefined, CT.ModTypes.VcDeafenRemove, {
     dbOnly: false,
     executor: (await getBotMemberFromGuild(options.guild)).user,
     guild: options.guild,
     reason: language.mod.execution.vcDeafenRemove.reason,
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
