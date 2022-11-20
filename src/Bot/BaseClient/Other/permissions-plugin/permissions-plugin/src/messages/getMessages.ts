
import { requireBotChannelPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function getMessages<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const getMessages = bot.helpers.getMessages;

  bot.helpers.getMessages = async function (channelId, options) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(channelId));
    if (channel?.guildId) {
      requireBotChannelPermissions(bot, channel, [
        "READ_MESSAGE_HISTORY",
        "VIEW_CHANNEL",
      ]);
    }

    return await getMessages(channelId, options);
  };
}
