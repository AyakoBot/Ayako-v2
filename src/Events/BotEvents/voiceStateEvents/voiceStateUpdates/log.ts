import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (
 oldState: Discord.VoiceState,
 state: Discord.VoiceState,
 member?: Discord.GuildMember,
) => {
 if (!state.channel) return;
 if (!oldState.channel) return;
 if (!member) return;

 const channels = await state.client.util.getLogChannels('voiceevents', member.guild);
 if (!channels) return;

 const language = await state.client.util.getLanguage(state.guild.id);
 const lan = language.events.logs.voiceState;
 const con = state.client.util.constants.events.logs.voiceState;
 const channelType = state.client.util.getTrueChannelType(state.channel, state.guild);
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameUpdate,
   icon_url: con.update,
  },
  color: CT.Colors.Loading,
  description: lan.descUpdate(
   member.user,
   state.channel,
   language.channelTypes[state.channel.type],
  ),
  fields: [],
  timestamp: new Date().toISOString(),
 };

 const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
  state.client.util.mergeLogging(before, after, type, embed, language, name);

 if (state.requestToSpeakTimestamp !== oldState.requestToSpeakTimestamp) {
  merge(
   oldState.requestToSpeakTimestamp,
   state.requestToSpeakTimestamp,
   'boolean',
   lan.requestToSpeak,
  );
 }
 if (state.serverDeaf !== oldState.serverDeaf) {
  merge(oldState.serverDeaf, state.serverDeaf, 'boolean', lan.deaf);
 }
 if (state.serverMute !== oldState.serverMute) {
  merge(oldState.serverMute, state.serverMute, 'boolean', lan.mute);
 }
 if (state.selfDeaf !== oldState.selfDeaf) {
  merge(oldState.selfDeaf, state.selfDeaf, 'boolean', lan.selfDeaf);
 }
 if (state.selfMute !== oldState.selfMute) {
  merge(oldState.selfMute, state.selfMute, 'boolean', lan.selfMute);
 }
 if (state.streaming !== oldState.streaming) {
  merge(oldState.streaming, state.streaming, 'boolean', lan.selfStream);
 }
 if (state.selfVideo !== oldState.selfVideo) {
  merge(oldState.selfVideo, state.selfVideo, 'boolean', lan.selfVideo);
 }
 if (state.channelId !== oldState.channelId) {
  if (embed.author) {
   embed.author.name = lan[`${channelType}Switch` as keyof typeof lan] as string;
   embed.author.icon_url = con[`${channelType}Switch` as keyof typeof con];
  }

  embed.description = lan.descUpdateChannel(
   member.user,
   state.channel,
   language.channelTypes[state.channel.type],
   oldState.channel,
   oldState.channel ? language.channelTypes[oldState.channel.type] : undefined,
  );

  merge(
   oldState.channel
    ? language.languageFunction.getChannel(
       oldState.channel,
       language.channelTypes[oldState.channel.type],
      )
    : language.t.None,
   state.channel
    ? language.languageFunction.getChannel(state.channel, language.channelTypes[state.channel.type])
    : language.t.None,
   'string',
   language.t.Channel,
  );
 }

 if (!embed.fields?.length) return;

 state.client.util.send(
  { id: channels, guildId: state.guild.id },
  { embeds: [embed], files },
  10000,
 );
};
