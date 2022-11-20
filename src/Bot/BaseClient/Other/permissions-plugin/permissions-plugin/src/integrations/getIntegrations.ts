
import { requireBotGuildPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function getIntegrations<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const getIntegrations = bot.helpers.getIntegrations;

  bot.helpers.getIntegrations = async function (guildId) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["MANAGE_GUILD"]);

    return await getIntegrations(guildId);
  };
}
