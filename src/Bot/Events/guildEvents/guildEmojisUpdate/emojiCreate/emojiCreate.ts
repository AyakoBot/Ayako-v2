import type * as DDeno from 'discordeno';

export default async (emote: DDeno.DiscordEmoji, guild: DDeno.Guild) => {
  const files: {
    default: (e: DDeno.DiscordEmoji, g: DDeno.Guild) => void;
  }[] = await Promise.all(['./log.js', './cache.js'].map((p) => import(p)));

  files.forEach((f) => f.default(emote, guild));
};
