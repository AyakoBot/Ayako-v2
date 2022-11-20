
import { requireBotGuildPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function getBan<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const getBan = bot.helpers.getBan;

  bot.helpers.getBan = async function (guildId, memberId) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["BAN_MEMBERS"]);

    return await getBan(guildId, memberId);
  };
}
