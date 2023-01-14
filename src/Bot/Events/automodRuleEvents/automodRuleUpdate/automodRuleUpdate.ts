import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (rule: DDeno.AutoModerationRule) => {
  if (!rule.guildId) return;

  const cached = client.ch.cache.automodRules.find(rule.id);
  client.ch.cache.automodRules.set(rule);

  const files: {
    default: (t: DDeno.AutoModerationRule, r: DDeno.AutoModerationRule | undefined) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(rule, cached));
};
