
import { requireBotChannelPermissions } from "../../permissions";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../../..";

export function createInvite<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const createInvite = bot.helpers.createInvite;

  bot.helpers.createInvite = async function (channelId, options = {}) {
    requireBotChannelPermissions(bot, BigInt(channelId), ["CREATE_INSTANT_INVITE"]);

    return await createInvite(channelId, options);
  };
}
