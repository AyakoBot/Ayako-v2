import type * as DDeno from 'discordeno';

export default async (emote: DDeno.Emoji, guild: DDeno.Guild) => {
  const files: {
    default: (e: DDeno.Emoji, g: DDeno.Guild) => void;
  }[] = await Promise.all(['./log.js', './cache.js'].map((p) => import(p)));

  files.forEach((f) => f.default(emote, guild));
};
