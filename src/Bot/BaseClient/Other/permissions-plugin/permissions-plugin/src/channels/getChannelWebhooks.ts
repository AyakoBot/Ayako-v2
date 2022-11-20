import type { Bot } from "discordeno";
import { ChannelTypes } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
import { requireBotChannelPermissions } from "../permissions";

export function getChannelWebhooks<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  const getChannelWebhooks = bot.helpers.getChannelWebhooks;

  bot.helpers.getChannelWebhooks = async function (channelId) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(channelId));
    if (channel) {
      const isWebhookParent = [ChannelTypes.GuildAnnouncement, ChannelTypes.GuildText].includes(channel.type);
      if (!isWebhookParent) {
        throw new Error("Target channel must be a text channel or an announcement channel");
      }
      requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), ["VIEW_CHANNEL", "MANAGE_WEBHOOKS"]);
    }

    return await getChannelWebhooks(channelId);
  };
}
