
import { requireBotChannelPermissions } from "../permissions";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function deleteMessage<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const deleteMessage = bot.helpers.deleteMessage;

  bot.helpers.deleteMessage = async function (channelId, messageId, reason, milliseconds) {
    const message = bot.cache.messages.memory.get(bot.transformers.snowflake(messageId));
    // DELETING SELF MESSAGES IS ALWAYS ALLOWED
    if (message?.authorId === bot.id) return deleteMessage(channelId, messageId, reason, milliseconds);

    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(channelId));
    if (channel?.guildId) {
      requireBotChannelPermissions(bot, channel, [
        "MANAGE_MESSAGES",
      ]);
    } else {
      throw new Error(
        `You can only delete messages in a channel which has a guild id. Channel ID: ${channelId} Message Id: ${messageId}`,
      );
    }

    return await deleteMessage(channelId, messageId, reason, milliseconds);
  };
}
