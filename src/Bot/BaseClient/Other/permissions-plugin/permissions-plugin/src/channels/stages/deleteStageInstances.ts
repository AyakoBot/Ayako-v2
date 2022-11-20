
import { Bot, ChannelTypes } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { requireBotChannelPermissions } from "../../permissions";

export function deleteStageInstance<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const deleteStageInstance = bot.helpers.deleteStageInstance;

  bot.helpers.deleteStageInstance = async function (channelId) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(channelId));
    if (channel && channel.type !== ChannelTypes.GuildStageVoice) {
      throw new Error("Channel must be a stage voice channel");
    }
    requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), [
      "VIEW_CHANNEL",
      "CONNECT",
      "MANAGE_CHANNELS",
      "MUTE_MEMBERS",
      "MOVE_MEMBERS",
    ]);

    return await deleteStageInstance(channelId);
  };
}
