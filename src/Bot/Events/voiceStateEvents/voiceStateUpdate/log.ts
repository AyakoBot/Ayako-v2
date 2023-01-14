import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';
import type CT from '../../../Typings/CustomTypings';

export default async (oldVoiceState: DDeno.VoiceState, voiceState: DDeno.VoiceState) => {
  if (!voiceState.guildId) return;
  if (!voiceState.channelId) return;

  const channels = await client.ch.getLogChannels('voiceevents', { guildId: voiceState.guildId });
  if (!channels) return;

  const channel = await client.ch.cache.channels.get(voiceState.channelId, voiceState.guildId);
  if (!channel) return;

  const guild = await client.ch.cache.guilds.get(voiceState.guildId);
  if (!guild) return;

  const user = await client.ch.cache.users.get(voiceState.userId);
  if (!user) return;

  const language = await client.ch.languageSelector(voiceState.guildId);
  const lan = language.events.logs.voiceState;
  const con = client.customConstants.events.logs.voiceState;
  const channelType = client.ch.getTrueChannelType(channel, guild);
  const files: DDeno.FileContent[] = [];

  const embed: DDeno.Embed = {
    author: {
      name: lan[`${channelType}Leave` as keyof typeof lan] as string,
      iconUrl: con[`${channelType}Leave` as keyof typeof con],
    },
    color: client.customConstants.colors.warning,
    description: lan.descCreate(user, channel, language.channelTypes[channel.type]),
  };

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  switch (true) {
    case voiceState.requestToSpeakTimestamp !== oldVoiceState.requestToSpeakTimestamp: {
      merge(
        oldVoiceState.requestToSpeakTimestamp,
        voiceState.requestToSpeakTimestamp,
        'boolean',
        lan.requestToSpeak,
      );
      break;
    }
    case voiceState.toggles.deaf !== oldVoiceState.toggles.deaf: {
      merge(oldVoiceState.toggles.deaf, voiceState.toggles.deaf, 'boolean', lan.deaf);
      break;
    }
    case voiceState.toggles.mute !== oldVoiceState.toggles.mute: {
      merge(oldVoiceState.toggles.mute, voiceState.toggles.mute, 'boolean', lan.mute);
      break;
    }
    case voiceState.toggles.selfDeaf !== oldVoiceState.toggles.selfDeaf: {
      merge(oldVoiceState.toggles.selfDeaf, voiceState.toggles.selfDeaf, 'boolean', lan.selfDeaf);
      break;
    }
    case voiceState.toggles.selfMute !== oldVoiceState.toggles.selfMute: {
      merge(oldVoiceState.toggles.selfMute, voiceState.toggles.selfMute, 'boolean', lan.selfMute);
      break;
    }
    case voiceState.toggles.selfStream !== oldVoiceState.toggles.selfStream: {
      merge(
        oldVoiceState.toggles.selfStream,
        voiceState.toggles.selfStream,
        'boolean',
        lan.selfStream,
      );
      break;
    }
    case voiceState.toggles.selfVideo !== oldVoiceState.toggles.selfVideo: {
      merge(
        oldVoiceState.toggles.selfVideo,
        voiceState.toggles.selfVideo,
        'boolean',
        lan.selfVideo,
      );
      break;
    }
    default: {
      return;
    }
  }

  client.ch.send(
    { id: channels, guildId: voiceState.guildId },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
