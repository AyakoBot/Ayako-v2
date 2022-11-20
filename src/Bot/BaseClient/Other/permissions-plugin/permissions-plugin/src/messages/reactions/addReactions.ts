import { requireBotChannelPermissions } from "../../permissions";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
export function addReactions<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const addReactions = bot.helpers.addReactions;

  bot.helpers.addReactions = async function (channelId, messageId, reactions, ordered) {
    requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), ["READ_MESSAGE_HISTORY", "ADD_REACTIONS"]);

    return await addReactions(channelId, messageId, reactions, ordered);
  };
}
