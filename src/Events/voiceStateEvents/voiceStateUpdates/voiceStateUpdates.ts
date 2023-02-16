import type * as Discord from 'discord.js';

export default async (
  oldState: Discord.VoiceState,
  state: Discord.VoiceState,
  member: Discord.Guild,
) => {
  const files: {
    default: (v: Discord.VoiceState, v2: Discord.VoiceState, m: Discord.Guild) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(oldState, state, member));
};
