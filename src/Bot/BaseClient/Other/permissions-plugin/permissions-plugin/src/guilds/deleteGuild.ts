
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function deleteGuild<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const deleteGuild = bot.helpers.deleteGuild;

  bot.helpers.deleteGuild = async function (guildId) {
    const guild = bot.cache.guilds.memory.get(bot.transformers.snowflake(guildId));
    if (guild && guild.ownerId !== bot.id) throw new Error("A bot can only delete a guild it owns.");

    return await deleteGuild(guildId);
  };
}
