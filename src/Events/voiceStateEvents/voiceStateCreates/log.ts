import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (state: Discord.VoiceState) => {
  if (!state.channel) return;
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
      name: lan[`${channelType}Join` as keyof typeof lan] as string,
      icon_url: con[`${channelType}Join` as keyof typeof con],
    },
    color: client.customConstants.colors.success,
    description: lan.descCreate(
      state.member.user,
      state.channel,
      language.channelTypes[state.channel.type],
    ),
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

  client.ch.send(
    { id: channels, guildId: state.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
