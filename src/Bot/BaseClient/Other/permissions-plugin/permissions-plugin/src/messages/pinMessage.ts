
import { requireBotChannelPermissions } from "../permissions";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";

export function pinMessage<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const pinMessage = bot.helpers.pinMessage;

  bot.helpers.pinMessage = async function (
    channelId,
    messageId,
  ) {
    requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), [
      "MANAGE_MESSAGES",
    ]);

    return await pinMessage(channelId, messageId);
  };
}