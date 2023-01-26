import type * as Discord from 'discord.js';
import client from '../../BaseClient/Client.js';

interface RealState extends Omit<Discord.VoiceState, 'channel' | 'member'> {
  channel?: Discord.VoiceChannel;
  member?: Discord.GuildMember;
}

export default async (oldState: RealState, state: RealState) => {
  if (!oldState.channel && oldState.channelId) {
    oldState.channel = (await client.ch.getChannel.guildVoiceChannel(
      oldState.channelId,
    )) as Discord.VoiceChannel;
  }

  if (!state.channel && state.channelId) {
    state.channel = (await client.ch.getChannel.guildVoiceChannel(
      state.channelId,
    )) as Discord.VoiceChannel;
  }

  if (!oldState.member && oldState.id) {
    oldState.member = await oldState.guild.members.fetch(state.id).catch(() => undefined);
  }

  if (!state.member && state.id) {
    state.member = await state.guild.members.fetch(state.id).catch(() => undefined);
  }

  if (!oldState.channelId) {
    (await import(`./voiceStateCreate/voiceStateCreates.js`)).default(state as Discord.VoiceState);
    return;
  }

  if (!state.channelId) {
    (await import(`./voiceStateDelete/voiceStateDeletes.js`)).default(
      oldState as Discord.VoiceState,
    );
    return;
  }

  (await import(`./voiceStateUpdate/voiceStateUpdates.js`)).default(
    oldState as Discord.VoiceState,
    state as Discord.VoiceState,
  );
};
