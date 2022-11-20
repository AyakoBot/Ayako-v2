
import { requireBotGuildPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function editEmoji<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const editEmoji = bot.helpers.editEmoji;

  bot.helpers.editEmoji = async function (guildId, id, options) {
    requireBotGuildPermissions(bot, bot.transformers.snowflake(guildId), ["MANAGE_EMOJIS_AND_STICKERS"]);

    return await editEmoji(guildId, id, options);
  };
}
