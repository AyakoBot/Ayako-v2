import type * as Discord from 'discord.js';

export default async (state: Discord.VoiceState, member: Discord.Guild) => {
  const files: {
    default: (v: Discord.VoiceState, m: Discord.Guild) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(state, member));
};
