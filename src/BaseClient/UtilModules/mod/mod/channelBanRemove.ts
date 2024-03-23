import * as Discord from 'discord.js';
import { ChannelBanBits } from '../../../../Typings/Channel.js';
import * as CT from '../../../../Typings/Typings.js';

import DataBase from '../../../Bot/DataBase.js';

import cache from '../../cache.js';
import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import type * as ModTypes from '../../mod.js';
import { request } from '../../requestHandler.js';

import actionAlreadyApplied from '../actionAlreadyApplied.js';
import err from '../err.js';
import getMembers from '../getMembers.js';
import permissionError from '../permissionError.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.ChannelBanRemove>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = CT.ModTypes.ChannelBanRemove;

 cache.channelBans.delete(options.guild.id, options.channel.id, options.target.id);

 const memberRes = await getMembers(cmd, options, language, message, type);
 if (memberRes && !memberRes.canExecute) return false;

 if (!memberRes) {
  const sticky = await DataBase.sticky.findUnique({ where: { guildid: options.guild.id } });
  if (!sticky?.stickypermsactive) return true;

  const stickyPermSetting = await DataBase.stickypermmembers.findUnique({
   where: { userid_channelid: { userid: options.target.id, channelid: options.channel.id } },
  });
  if (!stickyPermSetting) return true;

  const newDeny = new Discord.PermissionsBitField(
   stickyPermSetting?.denybits ? BigInt(stickyPermSetting.denybits) : 0n,
  ).remove(ChannelBanBits).bitfield;

  if (newDeny === 0n && stickyPermSetting.allowbits === 0n) {
   DataBase.stickypermmembers.delete({
    where: { userid_channelid: { userid: options.target.id, channelid: options.channel.id } },
   });
   return true;
  }

  DataBase.stickypermmembers
   .update({
    where: { userid_channelid: { userid: options.target.id, channelid: options.channel.id } },
    data: { denybits: newDeny },
   })
   .then();

  return true;
 }

 const me = await getBotMemberFromGuild(options.guild);
 if (
  (!me.permissions.has(Discord.PermissionFlagsBits.ManageChannels) ||
   !options.channel.permissionsFor(me).has(Discord.PermissionFlagsBits.ManageChannels)) &&
  !options.skipChecks
 ) {
  permissionError(cmd, message, language, type);
  return false;
 }

 const perm = options.channel.permissionOverwrites.cache.get(options.target.id);

 if (!perm || !perm?.deny.has(ChannelBanBits)) {
  actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const newPerms = new Discord.PermissionsBitField(ChannelBanBits);

 if (perm.deny.remove(newPerms).bitfield !== 0n || perm.allow.bitfield !== 0n) {
  const res = await request.channels.editPermissionOverwrite(
   options.channel,
   options.target.id,
   {
    type: Discord.OverwriteType.Member,
    deny: perm.deny.remove(newPerms).bitfield.toString(),
    allow: perm.allow.bitfield.toString(),
   },
   options.reason,
  );

  if (res && 'message' in res) {
   err(cmd, res, language, message, options.guild);
   return false;
  }
 } else {
  const res = await request.channels.deletePermissionOverwrite(
   options.channel,
   options.target.id,
   options.reason,
  );

  if (res && 'message' in res) {
   err(cmd, res, language, message, options.guild);
   return false;
  }
 }

 return true;
};
