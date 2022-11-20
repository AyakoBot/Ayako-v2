
import { requireBotChannelPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function deleteMessages<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const deleteMessages = bot.helpers.deleteMessages;

  bot.helpers.deleteMessages = async function (channelId, ids, reason) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(channelId));
    if (!channel?.guildId) {
      throw new Error(
        `Bulk deleting messages is only allowed in channels which has a guild id. Channel ID: ${channelId} IDS: ${
          ids.join(" ")
        }`,
      );
    }

    requireBotChannelPermissions(bot, channel, ["MANAGE_MESSAGES"]);

    return await deleteMessages(channelId, ids, reason);
  };
}
