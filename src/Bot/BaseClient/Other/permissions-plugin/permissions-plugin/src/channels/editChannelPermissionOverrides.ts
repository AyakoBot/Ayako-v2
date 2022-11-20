import type { Bot } from "discordeno";
import { PermissionStrings, ChannelTypes } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
import { requireBotChannelPermissions } from "../permissions";

export function editChannelPermissionOverrides<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  const editChannelPermissionOverrides = bot.helpers.editChannelPermissionOverrides;

  bot.helpers.editChannelPermissionOverrides = async function (channelId, overwrite) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(channelId));
    if (channel?.guildId) {
      const perms: PermissionStrings[] = ["VIEW_CHANNEL", "MANAGE_ROLES"];
      const isVoice = [ChannelTypes.GuildVoice, ChannelTypes.GuildStageVoice].includes(channel.type);

      if (isVoice) perms.push("CONNECT");

      requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), perms);
    }

    return await editChannelPermissionOverrides(channelId, overwrite);
  };
}
