import type * as Discord from 'discord.js';

export default async (rule: Discord.AutoModerationRule) => {
 rule.client.util.importCache.Events.BotEvents.autoModerationRuleEvents.autoModerationRuleDelete.log.file.default(
  rule,
 );
};
