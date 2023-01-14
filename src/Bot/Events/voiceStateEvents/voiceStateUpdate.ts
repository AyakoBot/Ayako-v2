import type * as DDeno from 'discordeno';
import client from '../../BaseClient/DDenoClient.js';

export default async (voiceState: DDeno.VoiceState) => {
  const cached = client.ch.cache.voiceStates.get(voiceState.userId, voiceState.guildId);
  client.ch.cache.voiceStates.set(voiceState);

  // TODO
};
