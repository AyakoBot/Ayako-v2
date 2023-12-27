import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

import cache from '../../cache.js';
import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import type * as ModTypes from '../../mod.js';
import { request } from '../../requestHandler.js';

import actionAlreadyApplied from '../actionAlreadyApplied.js';
import err from '../err.js';
import permissionError from '../permissionError.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.BanRemove>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = CT.ModTypes.BanRemove;

 cache.bans.delete(options.guild.id, options.target.id);

 const me = await getBotMemberFromGuild(options.guild);
 if (!me.permissions.has(Discord.PermissionFlagsBits.BanMembers) && !options.skipChecks) {
  permissionError(cmd, message, language, type);
  return false;
 }

 const existingBan = await request.guilds.getMemberBan(options.guild, options.target.id);
 if ('message' in existingBan && !options.skipChecks) {
  actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const res = await request.guilds.unbanUser(options.guild, options.target.id, options.reason);
 if (res && 'message' in res) {
  err(cmd, res, language, message, options.guild);
  return false;
 }

 return true;
};
