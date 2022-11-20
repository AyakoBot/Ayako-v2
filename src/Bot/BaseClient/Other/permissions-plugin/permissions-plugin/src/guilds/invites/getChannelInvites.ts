import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../../index";
import { requireBotChannelPermissions } from "../../permissions";

export function getChannelInvites<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  const getChannelInvites = bot.helpers.getChannelInvites;

  bot.helpers.getChannelInvites = async function (channelId) {
    requireBotChannelPermissions(bot, BigInt(channelId), ["MANAGE_CHANNELS"]);

    return await getChannelInvites(channelId);
  };
}
