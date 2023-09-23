import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (state: Discord.VoiceState, member?: Discord.GuildMember) => {
 if (!state.channel) return;
 if (!member) return;

 const channels = await ch.getLogChannels('voiceevents', member.guild);
 if (!channels) return;

 const language = await ch.getLanguage(state.guild.id);
 const lan = language.events.logs.voiceState;
 const con = ch.constants.events.logs.voiceState;
 const channelType = ch.getTrueChannelType(state.channel, state.guild);
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan[`${channelType}Join` as keyof typeof lan] as string,
   icon_url: con[`${channelType}Join` as keyof typeof con],
  },
  color: ch.constants.colors.success,
  description: lan.descCreate(
   member.user,
   state.channel,
   language.channelTypes[state.channel.type],
  ),
  timestamp: new Date().toISOString(),
 };

 const flagsText = [
  state.requestToSpeakTimestamp ? lan.requestToSpeak : null,
  state.serverDeaf ? lan.deaf : null,
  state.serverMute ? lan.mute : null,
  state.selfDeaf ? lan.selfDeaf : null,
  state.selfMute ? lan.selfMute : null,
  state.streaming ? lan.selfStream : null,
  state.selfVideo ? lan.selfVideo : null,
 ]
  .filter((f): f is string => !!f)
  .map((f) => `\`${f}\``)
  .join(', ');

 if (flagsText) {
  embed.fields?.push({
   name: language.Flags,
   value: flagsText,
   inline: true,
  });
 }

 ch.send({ id: channels, guildId: state.guild.id }, { embeds: [embed], files }, undefined, 10000);
};
