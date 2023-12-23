import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

import DataBase from '../../../DataBase.js';
import { ChannelBanBits } from '../../../Other/constants.js';

import objectEmotes from '../../emotes.js';
import getBotMemberFromGuild from '../../getBotMemberFromGuild.js';
import type * as ModTypes from '../../mod.js';
import { request } from '../../requestHandler.js';

import actionAlreadyApplied from '../actionAlreadyApplied.js';
import err from '../err.js';
import getMembers from '../getMembers.js';
import permissionError from '../permissionError.js';

export default async (
 options: CT.ModOptions<CT.ModTypes.ChannelBanAdd>,
 language: CT.Language,
 message: ModTypes.ResponseMessage,
 cmd: ModTypes.CmdType,
) => {
 const type = CT.ModTypes.ChannelBanAdd;

 if (options.channel.id === options.guild.rulesChannelId) {
  if (!message) return false;

  const payload = {
   embeds: [
    {
     color: CT.Colors.Danger,
     description: language.mod.execution.channelBanAdd.importantChannel,
     author: {
      icon_url: objectEmotes.warning.link,
      name: language.t.error,
     },
    },
   ],
  };

  if (message instanceof Discord.Message) request.channels.editMsg(message, payload);
  else if (!(cmd instanceof Discord.Message) && cmd) cmd.editReply(payload);
  return false;
 }

 const memberResponse = await getMembers(cmd, options, language, message, type);
 if (!memberResponse) {
  const sticky = await DataBase.sticky.findUnique({ where: { guildid: options.guild.id } });
  if (!sticky?.stickypermsactive) return false;

  const stickyPermSetting = await DataBase.stickypermmembers.findUnique({
   where: { userid_channelid: { userid: options.target.id, channelid: options.channel.id } },
  });

  DataBase.stickypermmembers
   .upsert({
    where: { userid_channelid: { userid: options.target.id, channelid: options.channel.id } },
    create: {
     userid: options.target.id,
     channelid: options.channel.id,
     guildid: options.guild.id,
     allowbits: 0n,
     denybits: new Discord.PermissionsBitField(ChannelBanBits).bitfield,
    },
    update: {
     denybits: new Discord.PermissionsBitField(
      stickyPermSetting?.denybits ? BigInt(stickyPermSetting.denybits) : 0n,
     ).add(ChannelBanBits).bitfield,
     allowbits: new Discord.PermissionsBitField(
      stickyPermSetting?.allowbits ? BigInt(stickyPermSetting.allowbits) : 0n,
     ).remove(ChannelBanBits).bitfield,
    },
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

 const perm = options.channel?.permissionOverwrites.cache.get(options.target.id);

 if (perm && perm.deny.has(ChannelBanBits) && !options.skipChecks) {
  actionAlreadyApplied(cmd, message, options.target, language, type);
  return false;
 }

 const newPerms = new Discord.PermissionsBitField(ChannelBanBits);

 const res = await request.channels.editPermissionOverwrite(
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
  err(cmd, res, language, message, options.guild);
  return false;
 }

 return true;
};
