
import { requireBotGuildPermissions } from "../permissions";
import type{ Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export async function createGuildSticker<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const createGuildSticker = bot.helpers.createGuildSticker;
  bot.helpers.createGuildSticker = (guildId, options) => {
    requireBotGuildPermissions(bot, guildId, ["MANAGE_EMOJIS_AND_STICKERS"]);
    return createGuildSticker(guildId, options);
  };
}
