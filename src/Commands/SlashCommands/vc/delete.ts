import { ChannelType, ChatInputCommandInteraction, StageChannel, VoiceChannel } from 'discord.js';
import { canDelete } from '../../../BaseClient/UtilModules/requestHandler/channels/delete.js';
import { getVCSettings } from './add/member.js';

export default async (cmd: ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const channel =
  cmd.options.getChannel('channel', false, [ChannelType.GuildVoice, ChannelType.GuildStageVoice]) ??
  (cmd.channel as VoiceChannel | StageChannel);

 const language = await cmd.client.util.getLanguage(cmd.guild.id);
 const lan = language.slashCommands.vc;

 const vcSettings = await getVCSettings(cmd.guild, channel.id);
 if (!vcSettings) {
  cmd.client.util.replyCmd(cmd, { content: lan.notVC });
  return;
 }

 if (vcSettings.ownerid !== cmd.user.id) {
  cmd.client.util.replyCmd(cmd, { content: lan.youNoPerms });
  return;
 }

 if (!canDelete(channel, await cmd.client.util.getBotMemberFromGuild(cmd.guild))) {
  cmd.client.util.replyCmd(cmd, { content: lan.meNoPerms });
  return;
 }

 const del = await cmd.client.util.request.channels.delete(channel);
 if ('message' in del) {
  cmd.client.util.replyCmd(cmd, { content: lan.meNoPerms });
  return;
 }

 cmd.client.util.cache.vcDeleteTimeout.delete(cmd.guildId, channel.id);

 if (cmd.channelId === channel.id) return;

 cmd.client.util.replyCmd(cmd, { content: lan.deleted });
};
