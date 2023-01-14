import type * as DDeno from 'discordeno';

export default async (voiceState: DDeno.VoiceState) => {
  const files: {
    default: (v: DDeno.VoiceState) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(voiceState));
};
