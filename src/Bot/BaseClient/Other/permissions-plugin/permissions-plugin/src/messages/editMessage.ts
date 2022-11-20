
import { requireBotChannelPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function editMessage<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const editMessage = bot.helpers.editMessage;

  bot.helpers.editMessage = function (channelId, messageId, content) {
    const message = bot.cache.messages.memory.get(BigInt(messageId));
    if (message) {
      if (message.authorId !== bot.id) {
        content = { flags: content.flags };
        requireBotChannelPermissions(bot, BigInt(channelId), ["MANAGE_MESSAGES"]);
      }
    }

    return editMessage(channelId, messageId, content);
  };
}
