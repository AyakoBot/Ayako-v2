import type * as Discord from 'discord.js';

export default async (
 oldRule: Discord.AutoModerationRule | undefined,
 rule: Discord.AutoModerationRule,
) => {
 rule.client.util.importCache.Events.BotEvents.autoModerationRuleEvents.autoModerationRuleUpdate.log.file.default(
  oldRule,
  rule,
 );
};
