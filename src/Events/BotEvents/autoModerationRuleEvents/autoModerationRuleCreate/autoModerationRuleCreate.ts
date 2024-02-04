import type * as Discord from 'discord.js';

export default async (rule: Discord.AutoModerationRule) => {
 rule.client.util.importCache.Events.BotEvents.autoModerationRuleEvents.autoModerationRuleCreate.log.file.default(
  rule,
 );
};
