
import { requireBotGuildPermissions } from "../../permissions";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
export function editWidgetSettings<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const editWidgetSettings = bot.helpers.editWidgetSettings;

  bot.helpers.editWidgetSettings = async function (guildId, enabled, channelId) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["MANAGE_GUILD"]);

    return await editWidgetSettings(guildId, enabled, channelId);
  };
}
