import { requireBotGuildPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export async function editGuildSticker<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  const editGuildSticker = bot.helpers.editGuildSticker;
  bot.helpers.editGuildSticker = (guildId, stickerId, options) => {
    requireBotGuildPermissions(bot, guildId, ["MANAGE_EMOJIS_AND_STICKERS"]);
    return editGuildSticker(guildId, stickerId, options);
  };
}
