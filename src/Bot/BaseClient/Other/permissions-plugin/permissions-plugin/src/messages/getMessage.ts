
import { requireBotChannelPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function getMessage<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const getMessage = bot.helpers.getMessage;

  bot.helpers.getMessage = async function (channelId, messageId) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(channelId));
    if (channel?.guildId) requireBotChannelPermissions(bot, channel, ["READ_MESSAGE_HISTORY"]);

    return await getMessage(channelId, messageId);
  };
}
