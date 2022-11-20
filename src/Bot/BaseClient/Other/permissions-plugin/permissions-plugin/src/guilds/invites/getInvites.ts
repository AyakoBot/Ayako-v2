import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../../index";
import { requireBotChannelPermissions } from "../../permissions";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function getInvites<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  const getInvites = bot.helpers.getInvites;

  bot.helpers.getInvites = async function (guildId) {
    requireBotChannelPermissions(bot, BigInt(guildId), ["MANAGE_GUILD"]);

    return await getInvites(guildId);
  };
}
