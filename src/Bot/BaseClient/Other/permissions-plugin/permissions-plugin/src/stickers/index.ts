
import { createGuildSticker } from "./createGuildSticker";
import { deleteGuildSticker } from "./deleteGuildSticker";
import { editGuildSticker } from "./editGuildSticker";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function stickers<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  createGuildSticker(bot);
  deleteGuildSticker(bot);
  editGuildSticker(bot);
}
