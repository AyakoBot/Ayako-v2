
import { requireBotGuildPermissions } from "../permissions";
import { Bot, GuildFeatures } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function editGuild<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const editGuild = bot.helpers.editGuild;

  bot.helpers.editGuild = async function (guildId, options, shardId) {
    if (options.features?.includes(GuildFeatures.Community)) {
      requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["ADMINISTRATOR"]);
    } else requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["MANAGE_GUILD"]);

    return await editGuild(guildId, options, shardId);
  };
}
