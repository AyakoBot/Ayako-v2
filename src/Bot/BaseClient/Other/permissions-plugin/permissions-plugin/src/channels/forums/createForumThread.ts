import type { Bot } from "discordeno";
import { ChannelTypes } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { requireBotChannelPermissions } from "../../permissions";

export function createForumThread<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  const createForumThread = bot.helpers.createForumThread;

  bot.helpers.createForumThread = async function (channelId, options) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(channelId));

    if (channel && channel.type !== ChannelTypes.GuildForum) {
      throw new Error("Channel must be a forum channel");
    }
    requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), ["VIEW_CHANNEL", "SEND_MESSAGES"]);

    return await createForumThread(channelId, options);
  };
}
