import type * as DDeno from 'discordeno';

export default async (role: DDeno.Role) => {
  const files: {
    default: (t: DDeno.Role) => void;
  }[] = await Promise.all(['./log.js', './cache.js'].map((p) => import(p)));

  files.forEach((f) => f.default(role));
};
