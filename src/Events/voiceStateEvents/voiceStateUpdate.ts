import type * as Discord from 'discord.js';
import { ch, client } from '../../BaseClient/Client.js';

interface RealState extends Omit<Discord.VoiceState, 'channel' | 'member'> {
  channel?: Discord.VoiceChannel;
  member?: Discord.GuildMember;
}

export default async (oldState: RealState, state: RealState) => {
  if (!oldState.channel && oldState.channelId) {
    oldState.channel = (await ch.getChannel.guildVoiceChannel(
      oldState.channelId,
    )) as Discord.VoiceChannel;
  }

  if (!state.channel && state.channelId) {
    state.channel = (await ch.getChannel.guildVoiceChannel(
      state.channelId,
    )) as Discord.VoiceChannel;
  }

  if (!oldState.channelId) {
    client.emit(
      'voiceStateCreates',
      state,
      await state.guild.members.fetch(state.id ?? oldState.id).catch(() => undefined),
    );
    return;
  }

  if (!state.channelId) {
    client.emit(
      'voiceStateDeletes',
      state,
      await state.guild.members.fetch(state.id ?? oldState.id).catch(() => undefined),
    );
    return;
  }

  client.emit(
    'voiceStateUpdates',
    oldState,
    state,
    await state.guild.members.fetch(state.id ?? oldState.id).catch(() => undefined),
  );
};
