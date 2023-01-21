import type * as Discord from 'discord.js';

export default async (sticker: Discord.Sticker) => {
  const files: {
    default: (s: Discord.Sticker) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(sticker));
};
