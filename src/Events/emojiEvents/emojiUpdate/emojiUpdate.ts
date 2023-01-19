import type * as Discord from 'discord.js';

export default async (oldEmote: Discord.GuildEmoji, emote: Discord.GuildEmoji) => {
  const files: {
    default: (e: Discord.GuildEmoji, o: Discord.GuildEmoji) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(oldEmote, emote));
};
