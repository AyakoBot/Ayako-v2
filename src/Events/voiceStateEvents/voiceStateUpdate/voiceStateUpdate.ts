import type * as Discord from 'discord.js';

export default async (oldVoiceState: DDeno.VoiceState, voiceState: DDeno.VoiceState) => {
  const files: {
    default: (v: DDeno.VoiceState, v2: DDeno.VoiceState) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(oldVoiceState, voiceState));
};
