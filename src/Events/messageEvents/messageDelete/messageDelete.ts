import type * as Discord from 'discord.js';

export default async (msg: Discord.Message) => {
  if (!msg.guild) return;

  const files: {
    default: (s: Discord.Message) => void;
  }[] = await Promise.all(['./log.js', './cache.js'].map((p) => import(p)));

  files.forEach((f) => f.default(msg));
};
