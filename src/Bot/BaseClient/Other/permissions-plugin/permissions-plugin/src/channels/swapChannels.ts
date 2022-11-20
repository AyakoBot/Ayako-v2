
import { requireBotChannelPermissions } from "../permissions";
import { Bot, ChannelTypes, PermissionStrings } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function swapChannels<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const swapChannels = bot.helpers.swapChannels;

  bot.helpers.swapChannels = async function (guildId, channelPositions) {
    for (const channelPosition of channelPositions) {
      const channel = bot.cache.channels.memory.get(BigInt(channelPosition.id));
      if (channel) {
        const perms: PermissionStrings[] = ["VIEW_CHANNEL", "MANAGE_CHANNELS"];
        const isVoice = [ChannelTypes.GuildVoice, ChannelTypes.GuildStageVoice].includes(channel.type);
        if (isVoice) perms.push("CONNECT");
        requireBotChannelPermissions(bot, BigInt(channelPosition.id), perms);
      }
    }
    return await swapChannels(guildId, channelPositions);
  };
}
