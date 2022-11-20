
import { requireBotChannelPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function publishMessage<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const publishMessage = bot.helpers.publishMessage;

  bot.helpers.publishMessage = function (channelId, messageId) {
    const message = bot.cache.messages.memory.get(bot.transformers.snowflake(messageId));

    requireBotChannelPermissions(
      bot,
      bot.transformers.snowflake(channelId),
      message?.authorId === bot.id ? ["SEND_MESSAGES"] : ["MANAGE_MESSAGES"],
    );

    return publishMessage(channelId, messageId);
  };
}
