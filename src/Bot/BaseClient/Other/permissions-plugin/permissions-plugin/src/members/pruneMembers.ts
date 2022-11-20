
import { requireBotGuildPermissions } from "../permissions";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function pruneMembers<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const pruneMembers = bot.helpers.pruneMembers;

  bot.helpers.pruneMembers = async function (guildId, options) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["KICK_MEMBERS"]);

    return await pruneMembers(guildId, options);
  };
}
