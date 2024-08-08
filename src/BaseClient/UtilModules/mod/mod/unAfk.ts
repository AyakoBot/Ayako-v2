import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import type * as ModTypes from '../../mod.js';

import { canEditMember } from '../../requestHandler/guilds/editMember.js';
import actionAlreadyApplied from '../actionAlreadyApplied.js';
import err from '../err.js';
import getMembers from '../getMembers.js';
import permissionError from '../permissionError.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.UnAfk>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = CT.ModTypes.UnAfk;

 const memberRes = await getMembers(cmd, options, language, message, type);
 if (memberRes && !memberRes.canExecute) return false;

 if (!memberRes) {
  const afk = await options.guild.client.util.DataBase.afk.findUnique({
   where: { userid_guildid: { guildid: options.guild.id, userid: options.target.id } },
  });

  if (!afk && !options.skipChecks) {
   actionAlreadyApplied(cmd, message, options.target, language, type);
   return false;
  }

  options.guild.client.util.DataBase.afk
   .delete({
    where: { userid_guildid: { guildid: options.guild.id, userid: options.target.id } },
   })
   .then();

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

 const afk = await options.guild.client.util.DataBase.afk.findUnique({
  where: { userid_guildid: { guildid: options.guild.id, userid: options.target.id } },
 });

 if (afk && !options.skipChecks) {
  actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 options.guild.client.util.DataBase.afk
  .delete({
   where: { userid_guildid: { guildid: options.guild.id, userid: options.target.id } },
  })
  .then();

 const res = await updateNickname(options.reason, targetMember);

 if ('message' in res) {
  err(cmd, res, language, message, options.guild);
  return false;
 }

 return true;
};

const updateNickname = async (reason: string, member: Discord.GuildMember) => {
 if (!member.nickname?.endsWith(' [AFK]')) return new Error('Member not AFK');

 return member.client.util.request.guilds.editMember(
  member,
  {
   nick: member.displayName.slice(0, member.displayName.length - 6),
  },
  reason,
 );
};
