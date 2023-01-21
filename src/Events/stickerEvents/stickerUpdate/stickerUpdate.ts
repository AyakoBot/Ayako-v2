import type * as Discord from 'discord.js';

export default async (oldSticker: Discord.Sticker, sticker: Discord.Sticker) => {
  const files: {
    default: (s: Discord.Sticker, o: Discord.Sticker) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(oldSticker, sticker));
};
