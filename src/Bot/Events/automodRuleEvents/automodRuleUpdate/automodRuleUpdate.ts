import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (rule: DDeno.AutoModerationRule) => {
  if (!rule.guildId) return;

  const oldRule = client.automodRules.get(rule.id);

  const files: {
    default: (t: DDeno.AutoModerationRule, r: DDeno.AutoModerationRule | undefined) => void;
  }[] = await Promise.all(['./log.js', './cache.js'].map((p) => import(p)));

  files.forEach((f) => f.default(rule, oldRule));
};
