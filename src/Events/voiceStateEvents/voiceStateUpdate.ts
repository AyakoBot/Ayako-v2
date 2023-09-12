import type * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';
import voiceStateCreates from './voiceStateCreates/voiceStateCreates.js';
import voiceStateDeletes from './voiceStateDeletes/voiceStateDeletes.js';
import voiceStateUpdates from './voiceStateUpdates/voiceStateUpdates.js';
import { GuildMember } from '../../BaseClient/Other/classes.js';

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
  state.channel = (await ch.getChannel.guildVoiceChannel(state.channelId)) as Discord.VoiceChannel;
 }

 if (!oldState.channelId) {
  voiceStateCreates(
   state as Discord.VoiceState,
   await ch.request.guilds
    .getMember(state.guild, state.id ?? oldState.id)
    .then((m) => ('message' in m ? undefined : new GuildMember(state.client, m, state.guild))),
  );
  return;
 }

 if (!state.channelId) {
  voiceStateDeletes(
   oldState as Discord.VoiceState,
   await ch.request.guilds
    .getMember(state.guild, state.id ?? oldState.id)
    .then((m) => ('message' in m ? undefined : new GuildMember(state.client, m, state.guild))),
  );
  return;
 }

 voiceStateUpdates(
  oldState as Discord.VoiceState,
  state as Discord.VoiceState,
  await ch.request.guilds
   .getMember(state.guild, state.id ?? oldState.id)
   .then((m) => ('message' in m ? undefined : new GuildMember(state.client, m, state.guild))),
 );
};
