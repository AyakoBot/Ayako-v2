import { BotWithCache } from "../../../deps";
import { requireBotChannelPermissions } from "../../permissions";

export function getInvites<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const getInvites = bot.helpers.getInvites;

  bot.helpers.getInvites = async function (guildId) {
    requireBotChannelPermissions(bot, guildId, ["MANAGE_GUILD"]);

    return await getInvites(guildId);
  };
}
