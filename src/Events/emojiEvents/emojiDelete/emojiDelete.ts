import type * as Discord from 'discord.js';

export default async (emote: Discord.GuildEmoji) => {
  const files: {
    default: (e: Discord.GuildEmoji) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(emote));
};
