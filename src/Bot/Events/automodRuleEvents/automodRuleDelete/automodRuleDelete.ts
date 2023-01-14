import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (rule: DDeno.AutoModerationRule) => {
  if (!rule.guildId) return;

  const cached = client.ch.cache.automodRules.find(rule.id);
  if (cached) rule = cached;
  client.ch.cache.automodRules.delete(rule.id);

  const files: {
    default: (t: DDeno.AutoModerationRule) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(rule));
};
