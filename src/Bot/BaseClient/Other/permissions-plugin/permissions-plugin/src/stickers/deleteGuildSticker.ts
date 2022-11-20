
import { requireBotGuildPermissions } from "../permissions";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export async function deleteGuildSticker<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  const deleteGuildSticker = bot.helpers.deleteGuildSticker;
  bot.helpers.deleteGuildSticker = (guildId, stickerId, reason) => {
    requireBotGuildPermissions(bot, guildId, ["MANAGE_EMOJIS_AND_STICKERS"]);
    return deleteGuildSticker(guildId, stickerId, reason);
  };
}
