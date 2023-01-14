import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (voiceState: DDeno.VoiceState) => {
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
      name: lan[`${channelType}Join` as keyof typeof lan] as string,
      iconUrl: con[`${channelType}Join` as keyof typeof con],
    },
    color: client.customConstants.colors.success,
    description: lan.descCreate(user, channel, language.channelTypes[channel.type]),
  };

  const flagsText = [
    voiceState.requestToSpeakTimestamp ? lan.requestToSpeak : null,
    voiceState.toggles.deaf ? lan.deaf : null,
    voiceState.toggles.mute ? lan.mute : null,
    voiceState.toggles.selfDeaf ? lan.selfDeaf : null,
    voiceState.toggles.selfMute ? lan.selfMute : null,
    voiceState.toggles.selfStream ? lan.selfStream : null,
    voiceState.toggles.selfVideo ? lan.selfVideo : null,
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

  client.ch.send(
    { id: channels, guildId: voiceState.guildId },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
