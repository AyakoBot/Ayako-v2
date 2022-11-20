
import { requireBotGuildPermissions } from "../permissions";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function deleteIntegration<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const deleteIntegration = bot.helpers.deleteIntegration;

  bot.helpers.deleteIntegration = async function (guildId, id) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["MANAGE_GUILD"]);

    return await deleteIntegration(guildId, id);
  };
}
