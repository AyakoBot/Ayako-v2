import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { requireBotGuildPermissions } from "../../permissions";

export function getAutomodRules<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const getAutomodRules = bot.helpers.getAutomodRules;

  bot.helpers.getAutomodRules = async function (guildId) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["MANAGE_GUILD"]);

    return await getAutomodRules(guildId);
  };
}
