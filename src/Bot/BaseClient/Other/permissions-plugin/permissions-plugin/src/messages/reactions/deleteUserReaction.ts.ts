import { requireBotChannelPermissions } from "../../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
export function deleteUserReaction<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const deleteUserReaction = bot.helpers.deleteUserReaction;

  bot.helpers.deleteUserReaction = async function (channelId, messageId, userId, reaction) {
    requireBotChannelPermissions(bot, bot.transformers.snowflake(channelId), ["MANAGE_MESSAGES"]);

    return await deleteUserReaction(channelId, messageId, userId, reaction);
  };
}
