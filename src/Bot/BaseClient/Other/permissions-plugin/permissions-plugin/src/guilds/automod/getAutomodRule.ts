import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { requireBotGuildPermissions } from "../../permissions";

export function getAutomodRule<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const getAutomodRule = bot.helpers.getAutomodRule;

  bot.helpers.getAutomodRule = async function (guildId, ruleId) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["MANAGE_GUILD"]);

    return await getAutomodRule(guildId, ruleId);
  };
}
