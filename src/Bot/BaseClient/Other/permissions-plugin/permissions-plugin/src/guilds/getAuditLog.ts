
import { requireBotGuildPermissions } from "../permissions";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function getAuditLog<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const getAuditLog = bot.helpers.getAuditLog;

  bot.helpers.getAuditLog = async function (guildId, options) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["VIEW_AUDIT_LOG"]);

    return await getAuditLog(guildId, options);
  };
}
