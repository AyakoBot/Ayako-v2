import { Bot, ChannelTypes, PermissionStrings } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
import { requireBotChannelPermissions } from "../permissions";

export function deleteChannelPermissionOverride<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const deleteChannelPermissionOverride = bot.helpers.deleteChannelPermissionOverride;

  bot.helpers.deleteChannelPermissionOverride = async function (channelId, overwriteId) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(channelId));

    if (channel?.guildId) {
      const perms: PermissionStrings[] = ["VIEW_CHANNEL", "MANAGE_ROLES"];
      const isVoice = [ChannelTypes.GuildVoice, ChannelTypes.GuildStageVoice].includes(channel.type);

      if (isVoice) perms.push("CONNECT");

      requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), perms);
    }

    return await deleteChannelPermissionOverride(channelId, overwriteId);
  };
}
