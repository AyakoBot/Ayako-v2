import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (rule: DDeno.AutoModerationRule) => {
  if (!rule.guildId) return;
  client.ch.cache.automodRules.set(rule);

  const files: {
    default: (t: DDeno.AutoModerationRule) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(rule));
};
