
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
import { requireBotGuildPermissions } from "../permissions";

export function getWelcomeScreen<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const getWelcomeScreen = bot.helpers.getWelcomeScreen;

  bot.helpers.getWelcomeScreen = async function (guildId) {
    const guild = bot.cache.guilds.memory.get(bot.transformers.snowflake(guildId));
    if (!guild?.welcomeScreen) requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["MANAGE_GUILD"]);

    return await getWelcomeScreen(guildId);
  };
}
