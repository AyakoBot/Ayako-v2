
import { Bot, ChannelTypes, PermissionStrings } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { requireBotChannelPermissions } from "../../permissions";

export function createStageInstance<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const createStageInstance = bot.helpers.createStageInstance;

  bot.helpers.createStageInstance = async function (options) {
    const channel = bot.cache.channels.memory.get(bot.transformers.snowflake(options.channelId));
    if (channel && channel.type !== ChannelTypes.GuildStageVoice) {
      throw new Error("Channel must be a stage voice channel");
    }

    const perms: PermissionStrings[] = ["VIEW_CHANNEL", "CONNECT", "MANAGE_CHANNELS", "MUTE_MEMBERS", "MOVE_MEMBERS"];
    if (options.sendStartNotification) perms.push("MENTION_EVERYONE");
    requireBotChannelPermissions(bot, bot.transformers.snowflake(options.channelId), perms);

    return await createStageInstance(options);
  };
}
