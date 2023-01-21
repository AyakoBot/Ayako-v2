import type * as Discord from 'discord.js';

export default async (stage: Discord.StageInstance) => {
  const files: {
    default: (p: Discord.StageInstance) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(stage));
};
