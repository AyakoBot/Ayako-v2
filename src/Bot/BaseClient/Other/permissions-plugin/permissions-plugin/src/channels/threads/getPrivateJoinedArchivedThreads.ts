
import { Bot, ChannelTypes } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { requireBotChannelPermissions } from "../../permissions";

export function getPrivateJoinedArchivedThreads<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const getPrivateJoinedArchivedThreads = bot.helpers.getPrivateJoinedArchivedThreads;
  bot.helpers.getPrivateJoinedArchivedThreads = async function (channelId, options) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(channelId));

    if (channel) {
      const isThreadParent = [ChannelTypes.GuildText, ChannelTypes.GuildAnnouncement, ChannelTypes.GuildForum]
        .includes(channel.type);
      if (!isThreadParent) {
        throw new Error("Channel must be a text channel, a forum channel, or an announcement channel");
      }
    }
    requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]);

    return await getPrivateJoinedArchivedThreads(channelId, options);
  };
}
