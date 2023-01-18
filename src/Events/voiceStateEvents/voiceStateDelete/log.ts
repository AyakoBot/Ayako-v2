import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (voiceState: DDeno.VoiceState) => {
  if (!voiceState.guild.id) return;
  if (!voiceState.channelId) return;

  const channels = await client.ch.getLogChannels('voiceevents', { guildId: voiceState.guild.id });
  if (!channels) return;

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
      name: lan[`${channelType}Switch` as keyof typeof lan] as string,
      icon_url: con[`${channelType}Switch` as keyof typeof con],
    },
    color: client.customConstants.colors.warning,
    description: lan.descDelete(user, channel, language.channelTypes[channel.type]),
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
    { id: channels, guildId: voiceState.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
