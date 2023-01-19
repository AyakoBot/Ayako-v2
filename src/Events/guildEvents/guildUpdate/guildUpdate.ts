import type * as Discord from 'discord.js';

export default async (oldGuild: Discord.Guild, guild: Discord.Guild) => {
  const files: {
    default: (g: Discord.Guild, oG: Discord.Guild) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(oldGuild, guild));
};
