import type * as DDeno from 'discordeno';

export default async (integration: DDeno.Integration) => {
  const files: {
    default: (i: DDeno.Integration) => void;
  }[] = await Promise.all(['./log.js', './cache.js'].map((p) => import(p)));

  files.forEach((f) => f.default(integration));
};
