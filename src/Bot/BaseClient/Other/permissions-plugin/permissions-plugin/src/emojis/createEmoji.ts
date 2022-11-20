
import { requireBotGuildPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function createEmoji<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const createEmoji = bot.helpers.createEmoji;

  bot.helpers.createEmoji = async function (guildId, id) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["MANAGE_EMOJIS_AND_STICKERS"]);

    return await createEmoji(guildId, id);
  };
}
