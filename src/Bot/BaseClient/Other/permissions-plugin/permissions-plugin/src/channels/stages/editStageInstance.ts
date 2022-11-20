import type { Bot } from "discordeno";
import { ChannelTypes } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { requireBotChannelPermissions } from "../../permissions";

export function editStageInstance<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  const editStageInstance = bot.helpers.editStageInstance;

  bot.helpers.editStageInstance = async function (channelId, data) {
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

    return await editStageInstance(channelId, data);
  };
}
