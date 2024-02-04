import type * as Discord from 'discord.js';

export default async (oldState: Discord.VoiceState, state: Discord.VoiceState) => {
 if (!oldState.channelId) {
  state.client.util.importCache.Events.BotEvents.voiceStateEvents.voiceStateCreates.voiceStateCreates.file.default(
   state as Discord.VoiceState,
   await state.client.util.request.guilds
    .getMember(state.guild, state.id ?? oldState.id)
    .then((m) => ('message' in m ? undefined : m)),
  );
  return;
 }

 if (!state.channelId) {
  state.client.util.importCache.Events.BotEvents.voiceStateEvents.voiceStateDeletes.voiceStateDeletes.file.default(
   oldState as Discord.VoiceState,
   await state.client.util.request.guilds
    .getMember(state.guild, state.id ?? oldState.id)
    .then((m) => ('message' in m ? undefined : m)),
  );
  return;
 }

 state.client.util.importCache.Events.BotEvents.voiceStateEvents.voiceStateUpdates.voiceStateUpdates.file.default(
  oldState as Discord.VoiceState,
  state as Discord.VoiceState,
  await state.client.util.request.guilds
   .getMember(state.guild, state.id ?? oldState.id)
   .then((m) => ('message' in m ? undefined : m)),
 );
};
