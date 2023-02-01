import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';

export default async (oldState: Discord.VoiceState, state: Discord.VoiceState) => {
  if (!state.channel) return;
  if (!oldState.channel) return;
  if (!state.member) return;

  const channels = await client.ch.getLogChannels('voiceevents', state.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(state.guild.id);
  const lan = language.events.logs.voiceState;
  const con = client.customConstants.events.logs.voiceState;
  const channelType = client.ch.getTrueChannelType(state.channel, state.guild);
  const files: Discord.AttachmentPayload[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameUpdate,
      icon_url: con.update,
    },
    color: client.customConstants.colors.loading,
    description: lan.descUpdate(
      state.member.user,
      state.channel,
      language.channelTypes[state.channel.type],
    ),
    fields: [],
  };

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

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
      state.member.user,
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
        : language.none,
      state.channel
        ? language.languageFunction.getChannel(
            state.channel,
            language.channelTypes[state.channel.type],
          )
        : language.none,
      'string',
      language.Channel,
    );
  }

  if (!embed.fields?.length) return;

  client.ch.send(
    { id: channels, guildId: state.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
