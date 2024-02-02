import * as Discord from 'discord.js';
import type * as CT from '../../../../Typings/Typings.js';

import type * as ModTypes from '../../mod.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.ChannelBanAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = options.guild.client.util.CT.ModTypes.ChannelBanAdd;

 if (options.channel.id === options.guild.rulesChannelId) {
  if (!message) return false;

  const payload = {
   embeds: [
    {
     color: options.guild.client.util.CT.Colors.Danger,
     description: language.mod.execution.channelBanAdd.importantChannel,
     author: {
      icon_url: options.guild.client.util.emotes.warning.link,
      name: language.t.error,
     },
    },
   ],
  };

  if (message instanceof Discord.Message) {
   options.guild.client.util.request.channels.editMsg(message, payload);
  } else if (!(cmd instanceof Discord.Message) && cmd) cmd.editReply(payload);
  return false;
 }

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
  if (!sticky?.stickypermsactive) return false;

  const stickyPermSetting = await options.guild.client.util.DataBase.stickypermmembers.findUnique({
   where: { userid_channelid: { userid: options.target.id, channelid: options.channel.id } },
  });

  options.guild.client.util.DataBase.stickypermmembers
   .upsert({
    where: { userid_channelid: { userid: options.target.id, channelid: options.channel.id } },
    create: {
     userid: options.target.id,
     channelid: options.channel.id,
     guildid: options.guild.id,
     allowbits: 0n,
     denybits: new Discord.PermissionsBitField(options.guild.client.util.CT.ChannelBanBits)
      .bitfield,
    },
    update: {
     denybits: new Discord.PermissionsBitField(
      stickyPermSetting?.denybits ? BigInt(stickyPermSetting.denybits) : 0n,
     ).add(options.guild.client.util.CT.ChannelBanBits).bitfield,
     allowbits: new Discord.PermissionsBitField(
      stickyPermSetting?.allowbits ? BigInt(stickyPermSetting.allowbits) : 0n,
     ).remove(options.guild.client.util.CT.ChannelBanBits).bitfield,
    },
   })
   .then();

  return true;
 }

 const me = await options.guild.client.util.getBotMemberFromGuild(options.guild);
 if (
  options.guild.client.util.importCache.BaseClient.UtilModules.requestHandler.channels.edit.file.canEdit(
   options.channel,
   { permission_overwrites: [] },
   me,
  ) &&
  !options.skipChecks
 ) {
  options.guild.client.util.mod.permissionError(cmd, message, language, type);
  return false;
 }

 const perm = options.channel?.permissionOverwrites.cache.get(options.target.id);

 if (perm && perm.deny.has(options.guild.client.util.CT.ChannelBanBits) && !options.skipChecks) {
  options.guild.client.util.mod.actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const newPerms = new Discord.PermissionsBitField(options.guild.client.util.CT.ChannelBanBits);

 const res = await options.guild.client.util.request.channels.editPermissionOverwrite(
  options.channel,
  options.target.id,
  {
   type: Discord.OverwriteType.Member,
   deny: (perm ? perm.deny.add(newPerms.bitfield) : newPerms).bitfield.toString(),
   allow: perm ? perm.allow.remove(newPerms.bitfield).bitfield.toString() : '0',
  },
  options.reason,
 );

 if (res && 'message' in res) {
  options.guild.client.util.mod.err(cmd, res, language, message, options.guild);
  return false;
 }

 return true;
};
