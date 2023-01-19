import type * as Discord from 'discord.js';

export default async (ban: Discord.GuildBan) => {
  const files: {
    default: (b: Discord.GuildBan) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(ban));
};
