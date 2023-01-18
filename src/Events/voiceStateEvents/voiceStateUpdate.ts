import type * as Discord from 'discord.js';
import client from '../../BaseClient/Client.js';

export default async (voiceState: DDeno.VoiceState) => {
  const cached = await client.ch.cache.voiceStates.get(voiceState.userId, voiceState.guildId);
  client.ch.cache.voiceStates.set(voiceState);

  if (!cached) {
    (await import(`./voiceStateCreate/voiceStateCreate.js`)).default(voiceState);
    return;
  }

  if (!voiceState) {
    (await import(`./voiceStateDelete/voiceStateDelete.js`)).default(cached);
    return;
  }

  (await import(`./voiceStateUpdate/voiceStateUpdate.js`)).default(cached, voiceState);
};
