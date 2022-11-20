import { requireBotChannelPermissions } from "../permissions";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
import { Bot } from "discordeno";
export function deleteWebhook<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  const deleteWebhook = bot.helpers.deleteWebhook;

  bot.helpers.deleteWebhook = async function (channelId, options) {
    requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), ["MANAGE_WEBHOOKS", "VIEW_CHANNEL"]);

    return await deleteWebhook(channelId, options);
  };
}
