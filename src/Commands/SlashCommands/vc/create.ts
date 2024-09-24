import { ChannelType, ChatInputCommandInteraction, StageChannel, VoiceChannel } from 'discord.js';
import { createVC } from '../../../Events/BotEvents/voiceStateEvents/voiceStateCreates/voiceHub.js';
import { type Language } from '../../../Typings/Typings.js';

export default async (cmd: ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const hub =
  cmd.options.getChannel('hub', false, [ChannelType.GuildVoice, ChannelType.GuildStageVoice]) ??
  (cmd.channel as VoiceChannel | StageChannel);

 const status = await createVC(cmd.client, cmd.guild, hub, cmd.member);
 const language = await cmd.client.util.getLanguage(cmd.guild.id);
 const content = getContent(status, language);

 cmd.client.util.replyCmd(cmd, { content });
};

const getContent = (status: Awaited<ReturnType<typeof createVC>>, language: Language) => {
 const lan = language.slashCommands.vc;

 switch (status.code) {
  case 1:
   return lan.notEnabled;
  case 2:
   return lan.notVH;
  case 3:
  case 4:
   return lan.excluded;
  case 5:
   return lan.notIncluded;
  case 6:
   return lan.meNoPerms;
  default:
   return lan.created(status.channel!);
 }
};
