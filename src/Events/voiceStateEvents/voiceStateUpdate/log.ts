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
      name: lan[`${channelType}Leave` as keyof typeof lan] as string,
      icon_url: con[`${channelType}Leave` as keyof typeof con],
    },
    color: client.customConstants.colors.warning,
    description: lan.descUpdate(
      state.member.user,
      state.channel,
      language.channelTypes[state.channel.type],
      oldState.channel,
      oldState.channel ? language.channelTypes[oldState.channel.type] : undefined,
    ),
  };

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  switch (true) {
    case state.requestToSpeakTimestamp !== oldState.requestToSpeakTimestamp: {
      merge(
        oldState.requestToSpeakTimestamp,
        state.requestToSpeakTimestamp,
        'boolean',
        lan.requestToSpeak,
      );
      break;
    }
    case state.serverDeaf !== oldState.serverDeaf: {
      merge(oldState.serverDeaf, state.serverDeaf, 'boolean', lan.deaf);
      break;
    }
    case state.serverMute !== oldState.serverMute: {
      merge(oldState.serverMute, state.serverMute, 'boolean', lan.mute);
      break;
    }
    case state.selfDeaf !== oldState.selfDeaf: {
      merge(oldState.selfDeaf, state.selfDeaf, 'boolean', lan.selfDeaf);
      break;
    }
    case state.selfMute !== oldState.selfMute: {
      merge(oldState.selfMute, state.selfMute, 'boolean', lan.selfMute);
      break;
    }
    case state.streaming !== oldState.streaming: {
      merge(oldState.streaming, state.streaming, 'boolean', lan.selfStream);
      break;
    }
    case state.selfVideo !== oldState.selfVideo: {
      merge(oldState.selfVideo, state.selfVideo, 'boolean', lan.selfVideo);
      break;
    }
    default: {
      return;
    }
  }

  client.ch.send(
    { id: channels, guildId: state.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
