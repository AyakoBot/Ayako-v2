
import { Bot, ChannelTypes } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { requireBotChannelPermissions } from "../../permissions";

export function joinThread<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const joinThread = bot.helpers.joinThread;

  bot.helpers.joinThread = async function (threadId) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(threadId));

    if (channel) {
      const isThread = ![ChannelTypes.PublicThread, ChannelTypes.PrivateThread, ChannelTypes.AnnouncementThread]
        .includes(channel.type);

      if (isThread) throw new Error("Channel must be a thread channel");

      if (channel.archived) throw new Error("You can not join an archived channel.");
    }
    requireBotChannelPermissions(bot, bot.transformers.snowflake(threadId), ["VIEW_CHANNEL"]);

    return await joinThread(threadId);
  };
}
