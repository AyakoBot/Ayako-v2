import type * as Discord from 'discord.js';
import voiceStateCreates from './voiceStateCreates/voiceStateCreates.js';
import voiceStateDeletes from './voiceStateDeletes/voiceStateDeletes.js';
import voiceStateUpdates from './voiceStateUpdates/voiceStateUpdates.js';

export default async (oldState: Discord.VoiceState, state: Discord.VoiceState) => {
 if (!oldState.channelId) {
  voiceStateCreates(
   state as Discord.VoiceState,
   await state.client.util.request.guilds
    .getMember(state.guild, state.id ?? oldState.id)
    .then((m) => ('message' in m ? undefined : m)),
  );
  return;
 }

 if (!state.channelId) {
  voiceStateDeletes(
   oldState as Discord.VoiceState,
   await state.client.util.request.guilds
    .getMember(state.guild, state.id ?? oldState.id)
    .then((m) => ('message' in m ? undefined : m)),
  );
  return;
 }

 voiceStateUpdates(
  oldState as Discord.VoiceState,
  state as Discord.VoiceState,
  await state.client.util.request.guilds
   .getMember(state.guild, state.id ?? oldState.id)
   .then((m) => ('message' in m ? undefined : m)),
 );
};
