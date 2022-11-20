import { requireBotGuildPermissions } from "../permissions";
import type { Bot } from "discordeno";
import { GuildFeatures } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function editGuild<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  const editGuild = bot.helpers.editGuild;

  bot.helpers.editGuild = async function (guildId, options, shardId) {
    if (options.features?.includes(GuildFeatures.Community)) {
      requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["ADMINISTRATOR"]);
    } else requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["MANAGE_GUILD"]);

    return await editGuild(guildId, options, shardId);
  };
}
