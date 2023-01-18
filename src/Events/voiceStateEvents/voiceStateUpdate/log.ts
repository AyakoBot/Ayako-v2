import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';

export default async (oldVoiceState: DDeno.VoiceState, voiceState: DDeno.VoiceState) => {
  if (!voiceState.guild.id) return;
  if (!voiceState.channelId) return;

  const channels = await client.ch.getLogChannels('voiceevents', { guildId: voiceState.guild.id });
  if (!channels) return;

  const oldChannel = oldVoiceState.channelId
    ? await client.ch.cache.channels.get(oldVoiceState.channelId, oldVoiceState.guild.id)
    : undefined;

  const channel = await client.ch.cache.channels.get(voiceState.channelId, voiceState.guild.id);
  if (!channel) return;

  const guild = await client.ch.cache.guilds.get(voiceState.guild.id);
  if (!guild) return;

  const user = await client.users.fetch(voiceState.userId);
  if (!user) return;

  const language = await client.ch.languageSelector(voiceState.guild.id);
  const lan = language.events.logs.voiceState;
  const con = client.customConstants.events.logs.voiceState;
  const channelType = client.ch.getTrueChannelType(channel, guild);
  const files: DDeno.FileContent[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan[`${channelType}Leave` as keyof typeof lan] as string,
      icon_url: con[`${channelType}Leave` as keyof typeof con],
    },
    color: client.customConstants.colors.warning,
    description: lan.descUpdate(
      user,
      channel,
      language.channelTypes[channel.type],
      oldChannel,
      oldChannel ? language.channelTypes[oldChannel.type] : undefined,
    ),
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
    { id: channels, guildId: voiceState.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
