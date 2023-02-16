import type * as Discord from 'discord.js';
import log from './log.js';

export default async (rule: Discord.AutoModerationRule) => {
  log(rule);
};
