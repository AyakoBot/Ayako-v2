import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (rule: DDeno.AutoModerationRule) => {
  if (!client.automodRules.get(rule.guildId)) client.automodRules.set(rule.guildId, new Map());
  client.automodRules.get(rule.guildId)?.set(rule.id, rule);
};
