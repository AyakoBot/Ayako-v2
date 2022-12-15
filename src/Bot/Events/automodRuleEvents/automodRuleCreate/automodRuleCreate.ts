import type * as DDeno from 'discordeno';

export default async (rule: DDeno.AutoModerationRule) => {
  if (!rule.guildId) return;

  const files: {
    default: (t: DDeno.AutoModerationRule) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(rule));
};
