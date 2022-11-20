
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
import { requireBotGuildPermissions } from "../permissions";

export function getVanityUrl<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const getVanityUrl = bot.helpers.getVanityUrl;

  bot.helpers.getVanityUrl = async function (guildId) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["MANAGE_GUILD"]);

    return await getVanityUrl(guildId);
  };
}
