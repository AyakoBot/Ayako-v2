import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as CT from '../../../Typings/CustomTypings.js';

import actionAlreadyApplied from './actionAlreadyApplied.js';
import permissionError from './permissionError.js';
import error from '../error.js';
import roleManager from '../roleManager.js';
import cache from '../cache.js';
import type * as ModTypes from '../mod.js';
import { request } from '../requestHandler.js';
import getMembers from './getMembers.js';
import getStrike from './getStrike.js';
import err from './err.js';
import constants from '../../Other/constants.js';
import objectEmotes from '../objectEmotes.js';
import getCustomBot from '../getCustomBot.js';
import isManageable from '../isManageable.js';
import isModeratable from '../isModeratable.js';
import DataBase from '../../DataBase.js';

const mod = {
 roleAdd: async (
  options: CT.ModOptions<'roleAdd'>,
  language: CT.Language,
  message: ModTypes.ResponseMessage,
  cmd: ModTypes.CmdType,
 ) => {
  const type = 'roleAdd';

  const memberResponse = await getMembers(cmd, options, language, message, type);
  if (!memberResponse) {
   const sticky = await DataBase.sticky.findUnique({ where: { guildid: options.guild.id } });
   if (!sticky?.stickyrolesactive) return false;

   const roles = sticky.stickyrolesmode
    ? options.roles.filter((r) => !sticky.roles.includes(r.id))
    : options.roles.filter((r) => sticky.roles.includes(r.id));
   if (!roles.length) return false;

   const stickyRoleSetting = await DataBase.stickyrolemembers.findUnique({
    where: { userid_guildid: { userid: options.target.id, guildid: options.guild.id } },
   });

   if (stickyRoleSetting?.roles.filter((r) => roles.find((r1) => r1.id === r)).length) {
    actionAlreadyApplied(cmd, message, options.target, language, type);
    return false;
   }

   DataBase.stickyrolemembers
    .upsert({
     where: { userid_guildid: { userid: options.target.id, guildid: options.guild.id } },
     create: {
      userid: options.target.id,
      guildid: options.guild.id,
      roles: roles.map((r) => r.id),
     },
     update: {
      roles: [...(stickyRoleSetting?.roles ?? []), ...roles.map((r) => r.id)],
     },
    })
    .then();

   return true;
  }
  const { targetMember } = memberResponse;

  if (targetMember.roles.cache.hasAll(...options.roles.map((r) => r.id))) {
   actionAlreadyApplied(cmd, message, options.target, language, type);
   return false;
  }

  const me = await getCustomBot(options.guild);
  options.roles = options.roles.filter((r) => r.position < Number(me.roles.highest.position));

  if (
   !me.permissions.has(Discord.PermissionFlagsBits.ManageRoles) ||
   !isManageable(targetMember, me) ||
   !options.roles.length
  ) {
   permissionError(cmd, message, language, type);
   return false;
  }

  await roleManager.add(
   targetMember,
   options.roles.map((r) => r.id),
   options.reason,
   1,
  );

  return true;
 },
 roleRemove: async (
  options: CT.ModOptions<'roleRemove'>,
  language: CT.Language,
  message: ModTypes.ResponseMessage,
  cmd: ModTypes.CmdType,
 ) => {
  const type = 'roleRemove';

  const memberResponse = await getMembers(cmd, options, language, message, type);
  if (!memberResponse) {
   const sticky = await DataBase.sticky.findUnique({ where: { guildid: options.guild.id } });
   if (!sticky?.stickyrolesactive) return true;

   const roles = sticky.stickyrolesmode
    ? options.roles.filter((r) => !sticky.roles.includes(r.id))
    : options.roles.filter((r) => sticky.roles.includes(r.id));
   if (!roles.length) return true;

   const stickyRoleSetting = await DataBase.stickyrolemembers.findUnique({
    where: { userid_guildid: { userid: options.target.id, guildid: options.guild.id } },
   });
   if (!stickyRoleSetting) return true;

   if (!stickyRoleSetting.roles.filter((r) => roles.find((r1) => r1.id === r)).length) {
    actionAlreadyApplied(cmd, message, options.target, language, type);
    return false;
   }

   const newRoles = stickyRoleSetting?.roles.filter((r) => !roles.find((r1) => r1.id === r)) ?? [];

   if (!newRoles.length) {
    DataBase.stickyrolemembers
     .delete({
      where: { userid_guildid: { userid: options.target.id, guildid: options.guild.id } },
     })
     .then();
    return true;
   }

   DataBase.stickyrolemembers
    .update({
     where: { userid_guildid: { userid: options.target.id, guildid: options.guild.id } },
     data: {
      roles: newRoles,
     },
    })
    .then();

   return true;
  }

  const { targetMember } = memberResponse;

  if (!targetMember.roles.cache.hasAny(...options.roles.map((r) => r.id))) {
   actionAlreadyApplied(cmd, message, options.target, language, type);
   return false;
  }

  const me = await getCustomBot(options.guild);
  options.roles = options.roles.filter((r) => r.position < Number(me.roles.highest.position));

  if (
   !me.permissions.has(Discord.PermissionFlagsBits.ManageRoles) ||
   !isManageable(targetMember, me) ||
   !options.roles.length
  ) {
   permissionError(cmd, message, language, type);
   return false;
  }

  await roleManager.remove(
   targetMember,
   options.roles.map((r) => r.id),
   options.reason,
   1,
  );

  return true;
 },
 tempMuteAdd: async (
  options: CT.ModOptions<'tempMuteAdd'>,
  language: CT.Language,
  message: ModTypes.ResponseMessage,
  cmd: ModTypes.CmdType,
 ) => {
  const type = 'tempMuteAdd';

  const memberResponse = await getMembers(cmd, options, language, message, type);
  if (!memberResponse) {
   const punishments = await DataBase.punish_tempmutes.findMany({
    where: { userid: options.target.id, guildid: options.guild.id },
   });

   const runningPunishment = punishments?.find(
    (p) => Number(p.uniquetimestamp) + Number(p.duration) * 1000 > Date.now(),
   );

   if (runningPunishment) {
    actionAlreadyApplied(cmd, message, options.target, language, type);
    return false;
   }
   return true;
  }
  const { targetMember } = memberResponse;

  const me = await getCustomBot(options.guild);
  if (!isModeratable(me, targetMember)) {
   permissionError(cmd, message, language, type);
   return false;
  }

  if (targetMember.isCommunicationDisabled()) {
   actionAlreadyApplied(cmd, message, options.target, language, type);
   return false;
  }

  const res = await request.guilds.editMember(
   options.guild,
   targetMember.id,
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
    () => {
     mod.muteRemove(options, language, message, cmd);
    },
   ),
   options.guild.id,
   options.target.id,
  );

  return true;
 },
 muteRemove: async (
  options: CT.ModOptions<'muteRemove'>,
  language: CT.Language,
  message: ModTypes.ResponseMessage,
  cmd: ModTypes.CmdType,
 ) => {
  const type = 'muteRemove';

  cache.mutes.delete(options.guild.id, options.target.id);

  const memberResponse = await getMembers(cmd, options, language, message, type);
  if (!memberResponse) {
   const punishments = await DataBase.punish_tempmutes.findMany({
    where: { userid: options.target.id, guildid: options.guild.id },
   });

   const runningPunishment = punishments?.find(
    (p) => Number(p.uniquetimestamp) + Number(p.duration) * 1000 > Date.now(),
   );

   if (!runningPunishment) {
    actionAlreadyApplied(cmd, message, options.target, language, type);
    return false;
   }
   return false;
  }
  const { targetMember } = memberResponse;

  const me = await getCustomBot(options.guild);
  if (!isModeratable(me, targetMember)) {
   permissionError(cmd, message, language, type);
   return false;
  }

  if (targetMember.isCommunicationDisabled()) {
   actionAlreadyApplied(cmd, message, options.target, language, type);
   return false;
  }

  const res = await request.guilds.editMember(options.guild, targetMember.id, {
   communication_disabled_until: null,
  });

  if ('message' in res) {
   err(cmd, res, language, message, options.guild);
   return false;
  }

  return true;
 },
 banAdd: async (
  options: CT.ModOptions<'banAdd'>,
  language: CT.Language,
  message: ModTypes.ResponseMessage,
  cmd: ModTypes.CmdType,
 ) => {
  const type = 'banAdd';

  const memberRes = await getMembers(cmd, options, language, message, type);
  const me = await getCustomBot(options.guild);
  if (
   (memberRes && !isModeratable(me, memberRes.targetMember)) ||
   !me.permissions.has(Discord.PermissionFlagsBits.BanMembers)
  ) {
   permissionError(cmd, message, language, type);
   return false;
  }

  if (options.guild.bans.cache.has(options.target.id)) {
   actionAlreadyApplied(cmd, message, options.target, language, type);
   return false;
  }

  const res = await request.guilds.banUser(
   options.guild,
   options.target.id,
   {
    delete_message_seconds: options.deleteMessageSeconds,
   },
   options.reason,
  );

  if (typeof res !== 'undefined' && 'message' in res) {
   err(cmd, res, language, message, options.guild);
   return false;
  }

  return true;
 },
 softBanAdd: async (
  options: CT.ModOptions<'softBanAdd'>,
  language: CT.Language,
  message: ModTypes.ResponseMessage,
  cmd: ModTypes.CmdType,
 ) => {
  const res = await mod.banAdd(options, language, message, cmd);
  if (!res) return false;

  const res2 = await mod.banRemove(options, language, message, cmd);
  if (!res2) return false;

  return true;
 },
 tempBanAdd: async (
  options: CT.ModOptions<'tempBanAdd'>,
  language: CT.Language,
  message: ModTypes.ResponseMessage,
  cmd: ModTypes.CmdType,
 ) => {
  const res = await mod.banAdd(options, language, message, cmd);
  if (!res) return res;

  cache.bans.set(
   Jobs.scheduleJob(new Date(Date.now() + options.duration * 1000), () => {
    mod.banRemove(options, language, message, cmd);
   }),
   options.guild.id,
   options.target.id,
  );

  return res;
 },
 banRemove: async (
  options: CT.ModOptions<'banRemove'>,
  language: CT.Language,
  message: ModTypes.ResponseMessage,
  cmd: ModTypes.CmdType,
 ) => {
  const type = 'banRemove';

  cache.bans.delete(options.guild.id, options.target.id);

  const me = await getCustomBot(options.guild);
  if (!me.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
   permissionError(cmd, message, language, type);
   return false;
  }

  if (!options.guild.bans.cache.has(options.target.id)) {
   actionAlreadyApplied(cmd, message, options.target, language, type);
   return false;
  }

  const res = await request.guilds.unbanUser(options.guild, options.target.id, options.reason);
  if (res && 'message' in res) {
   err(cmd, res, language, message, options.guild);
   return false;
  }

  return true;
 },
 kickAdd: async (
  options: CT.ModOptions<'kickAdd'>,
  language: CT.Language,
  message: ModTypes.ResponseMessage,
  cmd: ModTypes.CmdType,
 ) => {
  const type = 'kickAdd';

  const me = await getCustomBot(options.guild);
  if (!me.permissions.has(Discord.PermissionFlagsBits.KickMembers)) {
   permissionError(cmd, message, language, type);
   return false;
  }

  if (!options.guild.bans.cache.has(options.target.id)) {
   actionAlreadyApplied(cmd, message, options.target, language, type);
   return false;
  }

  const res = await request.guilds.removeMember(options.guild, options.target.id);
  if ((res as Discord.DiscordAPIError).message) {
   err(cmd, res as Discord.DiscordAPIError, language, message, options.guild);
   return false;
  }

  return true;
 },
 warnAdd: async () => true,
 softWarnAdd: async () => true,
 channelBanAdd: async (
  options: CT.ModOptions<'channelBanAdd'>,
  language: CT.Language,
  message: ModTypes.ResponseMessage,
  cmd: ModTypes.CmdType,
 ) => {
  const type = 'channelBanAdd';

  if (options.channel.id === options.guild.rulesChannelId) {
   if (!message) return false;

   const payload = {
    embeds: [
     {
      color: constants.colors.danger,
      description: language.mod.execution.channelBanAdd.importantChannel,
      author: {
       icon_url: objectEmotes.warning.link,
       name: language.error,
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
      denybits: new Discord.PermissionsBitField([
       Discord.PermissionsBitField.Flags.SendMessages,
       Discord.PermissionsBitField.Flags.SendMessagesInThreads,
       Discord.PermissionsBitField.Flags.ViewChannel,
       Discord.PermissionsBitField.Flags.AddReactions,
       Discord.PermissionsBitField.Flags.Connect,
      ]).bitfield,
     },
     update: {
      denybits: stickyPermSetting?.denybits
       ? new Discord.PermissionsBitField(stickyPermSetting.denybits).add([
          Discord.PermissionsBitField.Flags.SendMessages,
          Discord.PermissionsBitField.Flags.SendMessagesInThreads,
          Discord.PermissionsBitField.Flags.ViewChannel,
          Discord.PermissionsBitField.Flags.AddReactions,
          Discord.PermissionsBitField.Flags.Connect,
         ]).bitfield
       : undefined,
      allowbits: stickyPermSetting?.allowbits
       ? new Discord.PermissionsBitField(stickyPermSetting.allowbits).remove([
          Discord.PermissionsBitField.Flags.SendMessages,
          Discord.PermissionsBitField.Flags.SendMessagesInThreads,
          Discord.PermissionsBitField.Flags.ViewChannel,
          Discord.PermissionsBitField.Flags.AddReactions,
          Discord.PermissionsBitField.Flags.Connect,
         ]).bitfield
       : undefined,
     },
    })
    .then();
  }

  const me = await getCustomBot(options.guild);
  if (
   !me.permissions.has(Discord.PermissionFlagsBits.ManageChannels) ||
   !options.channel.permissionsFor(me).has(Discord.PermissionFlagsBits.ManageChannels)
  ) {
   permissionError(cmd, message, language, type);
   return false;
  }

  const perm = options.channel?.permissionOverwrites.cache.get(options.target.id);

  if (
   perm &&
   perm.deny.has(Discord.PermissionFlagsBits.SendMessages) &&
   perm.deny.has(Discord.PermissionFlagsBits.SendMessagesInThreads) &&
   perm.deny.has(Discord.PermissionFlagsBits.ViewChannel) &&
   perm.deny.has(Discord.PermissionFlagsBits.AddReactions) &&
   perm.deny.has(Discord.PermissionFlagsBits.Connect)
  ) {
   actionAlreadyApplied(cmd, message, options.target, language, type);
   return false;
  }

  const newPerms = new Discord.PermissionsBitField([
   Discord.PermissionsBitField.Flags.SendMessages,
   Discord.PermissionsBitField.Flags.SendMessagesInThreads,
   Discord.PermissionsBitField.Flags.ViewChannel,
   Discord.PermissionsBitField.Flags.AddReactions,
   Discord.PermissionsBitField.Flags.Connect,
  ]);

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
 },
 channelBanRemove: async (
  options: CT.ModOptions<'channelBanRemove'>,
  language: CT.Language,
  message: ModTypes.ResponseMessage,
  cmd: ModTypes.CmdType,
 ) => {
  const type = 'channelBanRemove';

  cache.channelBans.delete(options.guild.id, options.channel.id, options.target.id);

  const memberResponse = await getMembers(cmd, options, language, message, type);
  if (!memberResponse) {
   const sticky = await DataBase.sticky.findUnique({ where: { guildid: options.guild.id } });
   if (!sticky?.stickypermsactive) return true;

   const stickyPermSetting = await DataBase.stickypermmembers.findUnique({
    where: { userid_channelid: { userid: options.target.id, channelid: options.channel.id } },
   });
   if (!stickyPermSetting) return true;

   const newDeny = stickyPermSetting?.denybits
    ? new Discord.PermissionsBitField(stickyPermSetting.denybits).add([
       Discord.PermissionsBitField.Flags.SendMessages,
       Discord.PermissionsBitField.Flags.SendMessagesInThreads,
       Discord.PermissionsBitField.Flags.ViewChannel,
       Discord.PermissionsBitField.Flags.AddReactions,
       Discord.PermissionsBitField.Flags.Connect,
      ]).bitfield
    : undefined;

   const newAllow = stickyPermSetting?.allowbits
    ? new Discord.PermissionsBitField(stickyPermSetting.allowbits).remove([
       Discord.PermissionsBitField.Flags.SendMessages,
       Discord.PermissionsBitField.Flags.SendMessagesInThreads,
       Discord.PermissionsBitField.Flags.ViewChannel,
       Discord.PermissionsBitField.Flags.AddReactions,
       Discord.PermissionsBitField.Flags.Connect,
      ]).bitfield
    : undefined;

   if (newDeny === 0n && newAllow === 0n) {
    DataBase.stickypermmembers.delete({
     where: { userid_channelid: { userid: options.target.id, channelid: options.channel.id } },
    });
    return true;
   }

   DataBase.stickypermmembers
    .update({
     where: { userid_channelid: { userid: options.target.id, channelid: options.channel.id } },
     data: {
      denybits: newDeny,
      allowbits: newAllow,
     },
    })
    .then();
   return true;
  }

  const me = await getCustomBot(options.guild);
  if (
   !me.permissions.has(Discord.PermissionFlagsBits.ManageChannels) ||
   !options.channel.permissionsFor(me).has(Discord.PermissionFlagsBits.ManageChannels)
  ) {
   permissionError(cmd, message, language, type);
   return false;
  }

  const perm = options.channel.permissionOverwrites.cache.get(options.target.id);

  if (
   !perm ||
   (!perm?.deny.has(Discord.PermissionFlagsBits.SendMessages) &&
    !perm?.deny.has(Discord.PermissionFlagsBits.SendMessagesInThreads) &&
    !perm?.deny.has(Discord.PermissionFlagsBits.ViewChannel) &&
    !perm?.deny.has(Discord.PermissionFlagsBits.AddReactions) &&
    !perm?.deny.has(Discord.PermissionFlagsBits.Connect))
  ) {
   actionAlreadyApplied(cmd, message, options.target, language, type);
   return false;
  }

  const newPerms = new Discord.PermissionsBitField([
   Discord.PermissionsBitField.Flags.SendMessages,
   Discord.PermissionsBitField.Flags.SendMessagesInThreads,
   Discord.PermissionsBitField.Flags.ViewChannel,
   Discord.PermissionsBitField.Flags.AddReactions,
   Discord.PermissionsBitField.Flags.Connect,
  ]);

  if (perm.deny.remove(newPerms).bitfield === 0n && perm.allow.bitfield === 0n) {
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
 },
 tempChannelBanAdd: async (
  options: CT.ModOptions<'tempChannelBanAdd'>,
  language: CT.Language,
  message: ModTypes.ResponseMessage,
  cmd: ModTypes.CmdType,
 ) => {
  const res = await mod.channelBanAdd(options, language, message, cmd);
  if (!res) return res;

  cache.channelBans.set(
   Jobs.scheduleJob(new Date(Date.now() + options.duration * 1000), () => {
    mod.channelBanRemove(options, language, message, cmd);
   }),
   options.guild.id,
   options.channel.id,
   options.target.id,
  );

  return res;
 },
 strikeAdd: async (
  options: CT.ModOptions<'strikeAdd'>,
  language: CT.Language,
  message: ModTypes.ResponseMessage,
  cmd: ModTypes.CmdType,
 ) => {
  const strike = await getStrike(options.target, options.guild);
  if (!strike) return;

  if (!cmd) {
   error(options.guild, new Error('Guild not found'));
   return;
  }

  switch (strike.punishment) {
   case 'ban':
    mod.banAdd(
     {
      ...options,
      deleteMessageSeconds:
       strike.deletemessageseconds.toNumber() > 604800
        ? 604800
        : strike.deletemessageseconds.toNumber(),
     },
     language,
     message,
     cmd,
    );
    break;
   case 'channelban':
    if (!cmd.channel) {
     error(cmd.guild, new Error('No Channel found in strikeAdd'));
     return;
    }

    mod.channelBanAdd(
     {
      ...options,
      channel: cmd.channel.isThread()
       ? (cmd.channel.parent as NonNullable<typeof cmd.channel.parent>)
       : cmd.channel,
     },
     language,
     message,
     cmd,
    );
    break;
   case 'kick':
    mod.kickAdd(options, language, message, cmd);
    break;
   case 'tempmute':
    mod.tempMuteAdd(
     { ...options, duration: strike.duration.toNumber() * 1000 },
     language,
     message,
     cmd,
    );
    break;
   case 'tempchannelban':
    if (!cmd.channel) {
     error(cmd.guild, new Error('No channel found in strikeAdd'));
     return;
    }

    mod.tempChannelBanAdd(
     {
      ...options,
      duration: strike.duration.toNumber() * 1000,
      channel: cmd.channel.isThread()
       ? (cmd.channel.parent as NonNullable<typeof cmd.channel.parent>)
       : cmd.channel,
     },
     language,
     message,
     cmd,
    );
    break;
   case 'warn':
    mod.warnAdd();
    break;
   case 'tempban':
    mod.tempBanAdd(
     {
      ...options,
      duration: strike.duration.toNumber() * 1000,
      deleteMessageSeconds:
       strike.deletemessageseconds.toNumber() > 604800
        ? 604800
        : strike.deletemessageseconds.toNumber(),
     } as unknown as CT.ModOptions<'tempBanAdd'>,
     language,
     message,
     cmd,
    );
    break;
   case 'softban': {
    mod.softBanAdd(
     {
      ...options,
      deleteMessageSeconds:
       strike.deletemessageseconds.toNumber() > 604800
        ? 604800
        : strike.deletemessageseconds.toNumber(),
     },
     language,
     message,
     cmd,
    );
    break;
   }
   default: {
    mod.softWarnAdd();
    break;
   }
  }
 },
};

export default mod;
