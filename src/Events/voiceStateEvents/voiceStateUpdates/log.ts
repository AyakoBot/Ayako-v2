import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type CT from '../../../Typings/CustomTypings.js';

export default async (
  oldState: Discord.VoiceState,
  state: Discord.VoiceState,
  member: Discord.GuildMember,
) => {
  if (!state.channel) return;
  if (!oldState.channel) return;
  if (!member) return;

  const channels = await ch.getLogChannels('voiceevents', state.guild);
  if (!channels) return;

  const language = await ch.languageSelector(state.guild.id);
  const lan = language.events.logs.voiceState;
  const con = ch.constants.events.logs.voiceState;
  const channelType = ch.getTrueChannelType(state.channel, state.guild);
  const files: Discord.AttachmentPayload[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameUpdate,
      icon_url: con.update,
    },
    color: ch.constants.colors.loading,
    description: lan.descUpdate(
      member.user,
      state.channel,
      language.channelTypes[state.channel.type],
    ),
    fields: [],
  };

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    ch.mergeLogging(before, after, type, embed, language, name);

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
        : language.None,
      state.channel
        ? language.languageFunction.getChannel(
            state.channel,
            language.channelTypes[state.channel.type],
          )
        : language.None,
      'string',
      language.Channel,
    );
  }

  if (!embed.fields?.length) return;

  ch.send({ id: channels, guildId: state.guild.id }, { embeds: [embed], files }, undefined, 10000);
};
