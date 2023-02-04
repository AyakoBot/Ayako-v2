import type * as Discord from 'discord.js';

export default async (
  oldRule: Discord.AutoModerationRule | undefined,
  rule: Discord.AutoModerationRule,
) => {
  const files: {
    default: (o: Discord.AutoModerationRule | undefined, r: Discord.AutoModerationRule) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(oldRule, rule));
};
