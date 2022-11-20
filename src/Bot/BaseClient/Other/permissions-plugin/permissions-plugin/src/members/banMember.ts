
import { requireBotGuildPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function banMember<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const banMember = bot.helpers.banMember;

  bot.helpers.banMember = async function (guildId, id, options) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["BAN_MEMBERS"]);

    return await banMember(guildId, id, options);
  };
}
