import type * as Discord from 'discord.js';

export default async (oldState: Discord.VoiceState, state: Discord.VoiceState) => {
  if (!oldState.channelId) {
    (await import(`./voiceStateCreate/voiceStateCreate.js`)).default(state);
    return;
  }

  if (!state.channelId) {
    (await import(`./voiceStateDelete/voiceStateDelete.js`)).default(oldState);
    return;
  }

  (await import(`./voiceStateUpdate/voiceStateUpdate.js`)).default(oldState, state);
};
