import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
import { requireBotChannelPermissions } from "../permissions";

export function createWebhook<B extends Bot>(
  bot: BotWithProxyCache<ProxyCacheTypes, B>
) {
  const createWebhook = bot.helpers.createWebhook;

  bot.helpers.createWebhook = async function (channelId, options) {
    requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), ["MANAGE_WEBHOOKS", "VIEW_CHANNEL"]);

    return await createWebhook(channelId, options);
  };
}
