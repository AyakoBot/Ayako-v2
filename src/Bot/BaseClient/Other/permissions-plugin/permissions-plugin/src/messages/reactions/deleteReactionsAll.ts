import { requireBotChannelPermissions } from "../../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
export function deleteReactionsAll<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const deleteReactionsAll = bot.helpers.deleteReactionsAll;

  bot.helpers.deleteReactionsAll = async function (channelId, messageId) {
    requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), ["MANAGE_MESSAGES"]);

    return await deleteReactionsAll(channelId, messageId);
  };
}
