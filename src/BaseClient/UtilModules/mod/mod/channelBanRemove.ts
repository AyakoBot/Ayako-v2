import * as Discord from 'discord.js';
import type * as CT from '../../../../Typings/Typings.js';
import type * as ModTypes from '../../mod.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.ChannelBanRemove>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = options.guild.client.util.CT.ModTypes.ChannelBanRemove;

 options.guild.client.util.cache.channelBans.delete(
  options.guild.id,
  options.channel.id,
  options.target.id,
 );

 const memberRes = await options.guild.client.util.mod.getMembers(
  cmd,
  options,
  language,
  message,
  type,
 );
 if (memberRes && !memberRes.canExecute) return false;

 if (!memberRes) {
  const sticky = await options.guild.client.util.DataBase.sticky.findUnique({
   where: { guildid: options.guild.id },
  });
  if (!sticky?.stickypermsactive) return true;

  const stickyPermSetting = await options.guild.client.util.DataBase.stickypermmembers.findUnique({
   where: { userid_channelid: { userid: options.target.id, channelid: options.channel.id } },
  });
  if (!stickyPermSetting) return true;

  const newDeny = new Discord.PermissionsBitField(
   stickyPermSetting?.denybits ? BigInt(stickyPermSetting.denybits) : 0n,
  ).remove(options.guild.client.util.CT.ChannelBanBits).bitfield;

  if (newDeny === 0n && stickyPermSetting.allowbits === 0n) {
   options.guild.client.util.DataBase.stickypermmembers.delete({
    where: { userid_channelid: { userid: options.target.id, channelid: options.channel.id } },
   });
   return true;
  }

  options.guild.client.util.DataBase.stickypermmembers
   .update({
    where: { userid_channelid: { userid: options.target.id, channelid: options.channel.id } },
    data: { denybits: newDeny },
   })
   .then();

  return true;
 }

 const me = await options.guild.client.util.getBotMemberFromGuild(options.guild);
 if (
  (!me.permissions.has(Discord.PermissionFlagsBits.ManageChannels) ||
   !options.channel.permissionsFor(me).has(Discord.PermissionFlagsBits.ManageChannels)) &&
  !options.skipChecks
 ) {
  options.guild.client.util.mod.permissionError(cmd, message, language, type);
  return false;
 }

 const perm = options.channel.permissionOverwrites.cache.get(options.target.id);

 if (!perm || !perm?.deny.has(options.guild.client.util.CT.ChannelBanBits)) {
  options.guild.client.util.mod.actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const newPerms = new Discord.PermissionsBitField(options.guild.client.util.CT.ChannelBanBits);

 if (perm.deny.remove(newPerms).bitfield !== 0n || perm.allow.bitfield !== 0n) {
  const res = await options.guild.client.util.request.channels.editPermissionOverwrite(
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
   options.guild.client.util.mod.err(cmd, res, language, message, options.guild);
   return false;
  }
 } else {
  const res = await options.guild.client.util.request.channels.deletePermissionOverwrite(
   options.channel,
   options.target.id,
   options.reason,
  );

  if (res && 'message' in res) {
   options.guild.client.util.mod.err(cmd, res, language, message, options.guild);
   return false;
  }
 }

 return true;
};
