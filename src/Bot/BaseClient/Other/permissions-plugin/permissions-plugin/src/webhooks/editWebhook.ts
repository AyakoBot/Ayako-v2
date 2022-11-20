import { requireBotChannelPermissions } from "../permissions.js";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../index.js";
import type { Bot } from "discordeno";
export function editWebhook<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  const editWebhook = bot.helpers.editWebhook;

  bot.helpers.editWebhook = async function (webhookId, options) {
    if (options.channelId) {
      requireBotChannelPermissions(bot, bot.transformers.snowflake(options.channelId), [
        "MANAGE_WEBHOOKS",
        "VIEW_CHANNEL",
      ]);
    }
    if (options.channelId)
      requireBotChannelPermissions(bot, BigInt(options.channelId), ["MANAGE_WEBHOOKS", "VIEW_CHANNEL"]);

    return await editWebhook(webhookId, options);
  };
}
