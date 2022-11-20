import type { Bot } from "discordeno";
import { PermissionStrings, ChannelTypes } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
import { requireBotChannelPermissions } from "../permissions";

export function deleteChannel<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  const deleteChannel = bot.helpers.deleteChannel;

  bot.helpers.deleteChannel = async function (channelId, reason) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(channelId));

    if (channel?.guildId) {
      const guild = bot.cache.guilds.memory.get(channel.guildId);
      if (!guild) throw new Error("GUILD_NOT_FOUND");

      if (guild.rulesChannelId === channelId) throw new Error("RULES_CHANNEL_CANNOT_BE_DELETED");

      if (guild.publicUpdatesChannelId === channelId) throw new Error("UPDATES_CHANNEL_CANNOT_BE_DELETED");

      const perms: PermissionStrings[] = ["VIEW_CHANNEL"];
      const isThread = [
        ChannelTypes.AnnouncementThread,
        ChannelTypes.PublicThread,
        ChannelTypes.PrivateThread,
      ].includes(channel.type);
      const isVoice = [ChannelTypes.GuildVoice, ChannelTypes.GuildStageVoice].includes(channel.type);

      if (isThread) perms.push("MANAGE_THREADS");
      else perms.push("MANAGE_CHANNELS");

      if (isVoice) perms.push("CONNECT");

      requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), perms);
    }

    return await deleteChannel(channelId, reason);
  };
}
