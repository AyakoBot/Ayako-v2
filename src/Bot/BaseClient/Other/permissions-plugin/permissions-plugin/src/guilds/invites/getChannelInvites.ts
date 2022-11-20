import { BotWithCache } from "../../../deps";
import { requireBotChannelPermissions } from "../../permissions";

export function getChannelInvites<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const getChannelInvites = bot.helpers.getChannelInvites;

  bot.helpers.getChannelInvites = async function (channelId) {
    requireBotChannelPermissions(bot, channelId, ["MANAGE_CHANNELS"]);

    return await getChannelInvites(channelId);
  };
}
