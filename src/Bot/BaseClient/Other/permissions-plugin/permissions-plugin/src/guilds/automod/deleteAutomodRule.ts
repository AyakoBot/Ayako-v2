import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { requireBotGuildPermissions } from "../../permissions";

export function deleteAutomodRule<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const deleteAutomodRule = bot.helpers.deleteAutomodRule;

  bot.helpers.deleteAutomodRule = async function (guildId, options) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["MANAGE_GUILD"]);

    return await deleteAutomodRule(guildId, options);
  };
}
