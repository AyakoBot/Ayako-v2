import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (rule: DDeno.AutoModerationRule) => {
  if (!rule.guildId) return;
  client.ch.cache.automodRules.set(rule);

  const files: {
    default: (t: DDeno.AutoModerationRule) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(rule));
};
