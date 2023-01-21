import type * as Discord from 'discord.js';

export default async (typing: Discord.Typing) => {
  const files: {
    default: (t: Discord.Typing) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(typing));
};
