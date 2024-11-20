import {
 ChatInputCommandInteraction,
 GuildPremiumTier,
 StageChannel,
 VoiceChannel,
} from 'discord.js';
import { canEdit } from '../../../../BaseClient/UtilModules/requestHandler/channels/edit.js';
import { type Language } from '../../../../Typings/Typings.js';
import { getVCSettings, getVHSettings, isValidChannel } from '../add/member.js';

export enum Origin {
 name = 'name',
 bitrate = 'bitrate',
 userLimit = 'userLimit',
 region = 'region',
 nsfw = 'nsfw',
 slowmode = 'slowmode',
 video = 'video',
}

export default async (cmd: ChatInputCommandInteraction, origin: Origin = Origin.name) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 const channel = cmd.options.getChannel('channel', false) ?? cmd.channel;
 if (!channel) return;

 const payload = getPayload(origin, cmd);

 if (!isValidChannel(cmd, channel, language)) return;
 if (!(await validateSuccess(cmd, language, channel))) return;
 if (!(await meIsPermitted(cmd, language, channel, payload))) return;
 if (!(await youIsPermitted(cmd, language, channel, payload))) return;

 const lan = language.slashCommands.vc;
 await cmd.client.util.request.channels.edit(channel, payload);

 cmd.reply({ content: lan.edit[origin], ephemeral: true });
};

const validateSuccess = async (
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

 return true;
};

const meIsPermitted = async (
 cmd: ChatInputCommandInteraction<'cached'>,
 language: Language,
 channel: StageChannel | VoiceChannel,
 payload: Parameters<typeof canEdit>[1],
) => {
 if (canEdit(channel, payload, await cmd.client.util.getBotMemberFromGuild(cmd.guild))) {
  return true;
 }

 const lan = language.slashCommands.vc;
 cmd.client.util.errorCmd(cmd, lan.meNoPerms, language);
 return false;
};

const youIsPermitted = async (
 cmd: ChatInputCommandInteraction<'cached'>,
 language: Language,
 channel: StageChannel | VoiceChannel,
 payload: Parameters<typeof canEdit>[1],
) => {
 if (canEdit(channel, payload, cmd.member)) return true;

 const lan = language.slashCommands.vc;
 cmd.client.util.errorCmd(cmd, lan.youNoPerms, language);
 return false;
};

const getPayload = (
 origin: Origin,
 cmd: ChatInputCommandInteraction,
): Parameters<typeof canEdit>[1] => {
 switch (origin) {
  case Origin.name:
   return { name: cmd.options.getString('name', true) };
  case Origin.bitrate: {
   const getBitrate = (bitrate: number, premiumTier: number | undefined) => {
    if (
     (!premiumTier || [GuildPremiumTier.None, GuildPremiumTier.Tier1].includes(premiumTier)) &&
     bitrate > 96000
    ) {
     return 96000;
    }
    return bitrate;
   };

   const bitrate = cmd.options.getInteger('bitrate', true) * 1000;

   return { bitrate: getBitrate(bitrate, cmd.guild?.premiumTier) };
  }
  case Origin.userLimit:
   return { user_limit: cmd.options.getInteger('limit', true) };
  case Origin.region:
   return { rtc_region: cmd.options.getString('region', true) };
  case Origin.nsfw:
   return { nsfw: cmd.options.getBoolean('nsfw', true) };
  case Origin.slowmode:
   return {
    rate_limit_per_user:
     cmd.client.util.getDuration(cmd.options.getString('slowmode', true), 21600000) / 1000,
   };
  case Origin.video:
   return { video_quality_mode: Number(cmd.options.getString('quality', true)) };
  default:
   return {} as never;
 }
};
