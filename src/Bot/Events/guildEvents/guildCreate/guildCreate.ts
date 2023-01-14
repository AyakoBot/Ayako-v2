import type * as DDeno from 'discordeno';

export default async (guild: DDeno.Guild) => {
  const files: {
    default: (g: DDeno.Guild) => void;
  }[] = await Promise.all(['./log.js', './cache.js'].map((p) => import(p)));

  files.forEach((f) => f.default(guild));
};
