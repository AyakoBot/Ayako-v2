
import { requireBotGuildPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function kickMember<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const kickMember = bot.helpers.kickMember;

  bot.helpers.kickMember = async function (guildId, memberId, reason) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["KICK_MEMBERS"]);

    return await kickMember(guildId, memberId, reason);
  };
}
