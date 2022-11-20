
import { requireBotChannelPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function unpinMessage<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const unpinMessage = bot.helpers.unpinMessage;

  bot.helpers.unpinMessage = async function (channelId, messageId) {
    requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), ["MANAGE_MESSAGES"]);

    return await unpinMessage(channelId, messageId);
  };
}
