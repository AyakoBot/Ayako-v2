import type * as Discord from 'discord.js';

export default async (rule: Discord.AutoModerationRule) => {
  console.log(rule);

  const files: {
    default: (t: Discord.AutoModerationRule) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(rule));
};
