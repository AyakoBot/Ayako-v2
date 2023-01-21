import type * as Discord from 'discord.js';

export default async (role: Discord.Role) => {
  const files: {
    default: (t: Discord.Role) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(role));
};
