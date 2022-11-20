import type { Bot } from "discordeno";
import { ChannelTypes } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { requireBotChannelPermissions } from "../../permissions";

export function getPublicArchivedThreads<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  const getPublicArchivedThreads = bot.helpers.getPublicArchivedThreads;
  bot.helpers.getPublicArchivedThreads = async function (channelId, options) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(channelId));

    if (channel) {
      const isThreadParent = [ChannelTypes.GuildText, ChannelTypes.GuildAnnouncement, ChannelTypes.GuildForum].includes(
        channel.type
      );
      if (!isThreadParent) {
        throw new Error("Channel must be a text channel, a forum channel, or an announcement channel");
      }
    }
    requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]);

    return await getPublicArchivedThreads(channelId, options);
  };
}
