
import { Bot, ChannelTypes } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { requireBotChannelPermissions } from "../../permissions";

export function leaveThread<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const leaveThread = bot.helpers.leaveThread;

  bot.helpers.leaveThread = async function (threadId) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(threadId));

    if (channel) {
      const isThread = ![ChannelTypes.PublicThread, ChannelTypes.PrivateThread, ChannelTypes.AnnouncementThread]
        .includes(channel.type);

      if (isThread) throw new Error("Channel must be a thread channel");

      if (channel.archived) throw new Error("You can not leave an archived channel.");
    }
    requireBotChannelPermissions(bot, bot.transformers.snowflake(threadId), ["VIEW_CHANNEL"]);

    return await leaveThread(threadId);
  };
}
