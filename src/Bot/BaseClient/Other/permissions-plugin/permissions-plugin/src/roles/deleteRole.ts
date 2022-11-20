import { requireBotGuildPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function deleteRole<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  const deleteRole = bot.helpers.deleteRole;

  bot.helpers.deleteRole = async function (guildId, id) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["MANAGE_ROLES"]);

    return await deleteRole(guildId, id);
  };
}
