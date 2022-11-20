
import { requireBotChannelPermissions } from "../../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
export function addReaction<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const addReaction = bot.helpers.addReaction;

  bot.helpers.addReaction = async function (channelId, messageId, reaction) {
    requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), ["READ_MESSAGE_HISTORY", "ADD_REACTIONS"]);

    return await addReaction(channelId, messageId, reaction);
  };
}
