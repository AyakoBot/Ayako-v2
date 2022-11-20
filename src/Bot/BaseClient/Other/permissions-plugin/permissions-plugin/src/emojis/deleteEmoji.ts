
import { requireBotGuildPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function deleteEmoji<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const deleteEmoji = bot.helpers.deleteEmoji;

  bot.helpers.deleteEmoji = async function (guildId, id) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["MANAGE_EMOJIS_AND_STICKERS"]);

    return await deleteEmoji(guildId, id);
  };
}
