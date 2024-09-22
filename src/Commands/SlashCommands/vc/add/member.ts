import {
 ChannelType,
 ChatInputCommandInteraction,
 Guild,
 GuildMember,
 OverwriteType,
 PermissionFlagsBits,
 PermissionsBitField,
 StageChannel,
 VoiceChannel,
} from 'discord.js';
import type client from '../../../../BaseClient/Bot/Client.js';
import { canDeletePermissionOverwrite } from '../../../../BaseClient/UtilModules/requestHandler/channels/deletePermissionOverwrite.js';
import { canEditPermissionOverwrite } from '../../../../BaseClient/UtilModules/requestHandler/channels/editPermissionOverwrite.js';
import {
 managerPermissions,
 memberPermissions,
} from '../../../../Events/BotEvents/voiceStateEvents/voiceStateCreates/voiceHub.js';
import { Language } from '../../../../Typings/Typings.js';

export default async (
 cmd: ChatInputCommandInteraction,
 type: 'manager' | 'member' = 'member',
 action: 'promote' | 'demote' = 'promote',
) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 const member = cmd.options.getMember('user');
 if (!member) {
  cmd.client.util.errorCmd(cmd, language.errors.memberNotFound, language);
  return;
 }

 const channel = cmd.options.getChannel('channel', false) ?? cmd.channel;
 if (!channel) return;

 const vcSettings = await getVCSettings(cmd.guild, channel.id);
 if (member.id === vcSettings?.ownerid) {
  cmd.client.util.errorCmd(cmd, language.slashCommands.vc.youNoPerms, language);
  return;
 }

 if (!isValidChannel(cmd, channel, language)) return;
 if (!(await validateSuccess(cmd, language, channel))) return;

 const perms = getPerms(type, action);
 const lan = language.slashCommands.vc;

 if (perms) {
  if (!(await meIsPermittedEdit(cmd, channel, language, member, perms))) return;
  cmd.client.util.request.channels.editPermissionOverwrite(
   channel,
   member.id,
   perms,
   lan.reason(member.user.username),
  );
 } else {
  if (!(await meIsPermittedDel(cmd, channel, language))) return;
  cmd.client.util.request.channels.deletePermissionOverwrite(
   channel,
   member.id,
   lan.reason(member.user.username),
  );
 }

 cmd.reply({
  content: getLanFN(language, type, action)(
   member,
   channel,
   (await cmd.client.util.getCustomCommand(cmd.guild, 'vc'))?.id ?? '0',
  ),
  ephemeral: true,
 });
};

const getLanFN = (
 language: Language,
 origin: 'manager' | 'member',
 action: 'promote' | 'demote',
) => {
 const lan = language.slashCommands.vc;

 switch (origin) {
  case 'manager': {
   switch (action) {
    case 'demote':
     return lan.removedManager;
    case 'promote':
    default:
     return lan.addedManager;
   }
  }
  case 'member': {
   switch (action) {
    case 'demote':
     return lan.removedMember;
    case 'promote':
    default:
     return lan.addedMember;
   }
  }
 }
};

const getPerms = (
 type: 'manager' | 'member',
 action: 'promote' | 'demote',
): Parameters<typeof client.util.request.channels.editPermissionOverwrite>[2] | undefined => {
 switch (type) {
  case 'manager': {
   switch (action) {
    case 'demote':
     return {
      type: OverwriteType.Member,
      allow: new PermissionsBitField(memberPermissions).bitfield.toString(),
     };
    case 'promote':
    default:
     return {
      type: OverwriteType.Member,
      allow: new PermissionsBitField(managerPermissions).bitfield.toString(),
     };
   }
  }
  case 'member': {
   switch (action) {
    case 'promote':
     return {
      type: OverwriteType.Member,
      allow: new PermissionsBitField(memberPermissions).bitfield.toString(),
     };
    case 'demote':
    default:
     return undefined;
   }
  }
 }
};

export const validateSuccess = async (
 cmd: ChatInputCommandInteraction<'cached'>,
 language: Language,
 channel: VoiceChannel | StageChannel,
) => {
 const lan = language.slashCommands.vc;

 if (!(await getVHSettings(cmd.guild))) {
  cmd.client.util.errorCmd(cmd, lan.notEnabled, language);
  return false;
 }

 const vcSettings = await getVCSettings(cmd.guild, channel.id);
 if (!vcSettings) {
  cmd.client.util.errorCmd(cmd, lan.notVC, language);
  return false;
 }

 if (!isPermittedMember(cmd, channel, vcSettings, language)) return false;
 return true;
};

export const isValidChannel = (
 cmd: ChatInputCommandInteraction<'cached'>,
 channel: NonNullable<ReturnType<typeof cmd.options.getChannel>>,
 language: Language,
): channel is VoiceChannel | StageChannel => {
 if ([ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(channel.type)) return true;

 const lan = language.slashCommands.vc;
 cmd.client.util.errorCmd(cmd, lan.notVC, language);

 return false;
};

export const isPermittedMember = (
 cmd: ChatInputCommandInteraction<'cached'>,
 channel: StageChannel | VoiceChannel,
 vcSettings: NonNullable<Awaited<ReturnType<typeof getVCSettings>>>,
 language: Language,
) => {
 if (vcSettings.ownerid === cmd.member.id) return true;

 const lan = language.slashCommands.vc;
 const perms = channel.permissionsFor(cmd.member);
 if (perms.has(PermissionFlagsBits.ManageRoles)) return true;

 cmd.member.client.util.errorCmd(cmd, lan.youNoPerms, language);
 return false;
};

export const meIsPermittedDel = async (
 cmd: ChatInputCommandInteraction<'cached'>,
 channel: StageChannel | VoiceChannel,
 language: Language,
) => {
 if (
  canDeletePermissionOverwrite(channel.id, await cmd.client.util.getBotMemberFromGuild(cmd.guild))
 ) {
  return true;
 }

 const lan = language.slashCommands.vc;
 cmd.client.util.errorCmd(cmd, lan.meNoPerms, language);
 return false;
};
export const meIsPermittedEdit = async (
 cmd: ChatInputCommandInteraction<'cached'>,
 channel: StageChannel | VoiceChannel,
 language: Language,
 member: GuildMember,
 perms: Parameters<typeof cmd.client.util.request.channels.editPermissionOverwrite>[2],
) => {
 if (
  canEditPermissionOverwrite(
   channel.id,
   perms,
   member.id,
   await cmd.client.util.getBotMemberFromGuild(cmd.guild),
  )
 ) {
  return true;
 }

 const lan = language.slashCommands.vc;
 cmd.client.util.errorCmd(cmd, lan.meNoPerms, language);
 return false;
};

export const getVCSettings = (guild: Guild, channelid: string) =>
 guild.client.util.DataBase.voicechannels.findUnique({
  where: { guildid_channelid: { guildid: guild.id, channelid } },
 });

export const getVHSettings = async (guild: Guild) =>
 guild.client.util.DataBase.voicehubs.findFirst({
  where: { guildid: guild.id, active: true },
 });
