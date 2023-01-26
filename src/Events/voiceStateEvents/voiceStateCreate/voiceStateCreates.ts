import type * as Discord from 'discord.js';

export default async (state: Discord.VoiceState) => {
  const files: {
    default: (v: Discord.VoiceState) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(state));
};
