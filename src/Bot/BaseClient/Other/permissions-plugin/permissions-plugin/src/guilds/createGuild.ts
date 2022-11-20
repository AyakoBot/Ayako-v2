
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function createGuild<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const createGuild = bot.helpers.createGuild;

  bot.helpers.createGuild = async function (options) {
    if (bot.cache.guilds.memory.size > 10) throw new Error("A bot can not create a guild if it is already in 10 guilds.");

    return await createGuild(options);
  };
}
