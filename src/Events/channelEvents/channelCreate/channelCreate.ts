import type * as Discord from 'discord.js';

export default async (channel: Discord.GuildChannel) => {
  const files: {
    default: (t: Discord.GuildChannel) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(channel));
};
