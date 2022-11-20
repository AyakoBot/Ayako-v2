
import { requireBotGuildPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function getBans<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const getBans = bot.helpers.getBans;

  bot.helpers.getBans = async function (guildId) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["BAN_MEMBERS"]);

    return await getBans(guildId);
  };
}
