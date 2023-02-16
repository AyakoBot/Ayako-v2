import type * as Discord from 'discord.js';
import log from './log.js';

export default async (
  oldRule: Discord.AutoModerationRule | undefined,
  rule: Discord.AutoModerationRule,
) => {
  log(oldRule, rule);
};
