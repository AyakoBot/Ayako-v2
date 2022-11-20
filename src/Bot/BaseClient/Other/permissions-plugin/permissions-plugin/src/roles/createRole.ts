
import { requireBotGuildPermissions } from "../permissions";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function createRole<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const createRole = bot.helpers.createRole;

  bot.helpers.createRole = async function (guildId, options, reason) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["MANAGE_ROLES"]);

    if (options.name && !bot.utils.validateLength(options.name, { max: 100 })) {
      throw new Error("Role name must be less than 100 characters");
    }

    return await createRole(guildId, options, reason);
  };
}
