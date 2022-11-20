
import { Bot, ChannelTypes } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { requireBotChannelPermissions } from "../../permissions";

export function getPrivateArchivedThreads<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const getPrivateArchivedThreads = bot.helpers.getPrivateArchivedThreads;
  bot.helpers.getPrivateArchivedThreads = async function (channelId, options) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(channelId));

    if (channel) {
      const isThreadParent = [ChannelTypes.GuildText, ChannelTypes.GuildAnnouncement, ChannelTypes.GuildForum]
        .includes(channel.type);
      if (!isThreadParent) {
        throw new Error("Channel must be a text channel, a forum channel, or an announcement channel");
      }
    }

    requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), [
      "VIEW_CHANNEL",
      "READ_MESSAGE_HISTORY",
      "MANAGE_MESSAGES",
    ]);

    return await getPrivateArchivedThreads(channelId, options);
  };
}
