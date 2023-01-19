import type * as Discord from 'discord.js';

export default async (guild: Discord.Guild) => {
  const files: {
    default: (g: Discord.Guild) => void;
  }[] = await Promise.all(['./log.js', './cache.js'].map((p) => import(p)));

  files.forEach((f) => f.default(guild));
};
