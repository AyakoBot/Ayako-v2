
import { requireBotGuildPermissions } from "../permissions";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function modifyRolePositions<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const modifyRolePositions = bot.helpers.modifyRolePositions;

  bot.helpers.modifyRolePositions = async function (guildId, categoryId) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["MANAGE_ROLES"]);

    return await modifyRolePositions(guildId, categoryId);
  };
}
