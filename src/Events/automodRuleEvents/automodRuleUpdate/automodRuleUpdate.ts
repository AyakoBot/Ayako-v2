import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (rule: DDeno.AutoModerationRule) => {
  if (!rule.guild.id) return;

  const cached = client.ch.cache.automodRules.find(rule.id);
  client.ch.cache.automodRules.set(rule);

  const files: {
    default: (t: DDeno.AutoModerationRule, r: DDeno.AutoModerationRule | undefined) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(rule, cached));
};
