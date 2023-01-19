import type * as Discord from 'discord.js';

export default async (oldIntegration: Discord.Integration, integration: Discord.Integration) => {
  const files: {
    default: (oI: Discord.Integration, nI: Discord.Integration) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(oldIntegration, integration));
};
