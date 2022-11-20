import { requireBotChannelPermissions } from "../permissions";
import type { Bot } from "discordeno";
import { ChannelTypes, PermissionStrings } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function sendMessage<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  const sendMessage = bot.helpers.sendMessage;

  bot.helpers.sendMessage = async function (channelId, content) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(channelId));
    if (
      channel &&
      [ChannelTypes.GuildCategory, ChannelTypes.GuildStageVoice, ChannelTypes.GuildForum].includes(channel.type)
    ) {
      throw new Error(`Can not send message to a channel of this type. Channel ID: ${channelId}`);
    }

    if (channel) {
      const requiredPerms: PermissionStrings[] = [];
      if (channel.guildId) requiredPerms.push("SEND_MESSAGES");
      if (content.tts) requiredPerms.push("SEND_TTS_MESSAGES");
      if (content.messageReference) requiredPerms.push("READ_MESSAGE_HISTORY");
      if (requiredPerms.length) requireBotChannelPermissions(bot, channel, requiredPerms);
    }

    return await sendMessage(channelId, content);
  };
}
