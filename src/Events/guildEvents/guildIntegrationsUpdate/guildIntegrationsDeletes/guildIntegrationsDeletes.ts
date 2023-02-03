import type * as Discord from 'discord.js';

export default async (integration: Discord.Integration) => {
  const files: {
    default: (i: Discord.Integration) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(integration));
};
