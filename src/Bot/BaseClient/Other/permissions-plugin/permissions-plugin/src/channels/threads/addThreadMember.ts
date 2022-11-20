import { requireBotChannelPermissions } from "../../permissions";
import type { Bot } from "discordeno";
import { ChannelTypes } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../..";

export function addThreadMember<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  const addThreadMember = bot.helpers.addThreadMember;

  bot.helpers.addThreadMember = async function (threadId, userId) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(threadId));

    if (channel) {
      const isThread = ![
        ChannelTypes.PublicThread,
        ChannelTypes.PrivateThread,
        ChannelTypes.AnnouncementThread,
      ].includes(channel.type);

      if (isThread) throw new Error("Channel must be a thread channel");

      if (channel.archived) throw new Error("Cannot add user to thread if thread is archived.");

      requireBotChannelPermissions(bot, channel, ["VIEW_CHANNEL", "SEND_MESSAGES"]);
    }

    return await addThreadMember(threadId, userId);
  };
}
