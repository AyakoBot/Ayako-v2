import { requireBotGuildPermissions } from "../permissions";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export async function deleteGuildSticker<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  const deleteGuildSticker = bot.helpers.deleteGuildSticker;
  bot.helpers.deleteGuildSticker = (guildId, stickerId, reason) => {
    requireBotGuildPermissions(bot, guildId, ["MANAGE_EMOJIS_AND_STICKERS"]);
    return deleteGuildSticker(guildId, stickerId, reason);
  };
}
