
import { createEmoji } from "./createEmoji";
import { deleteEmoji } from "./deleteEmoji";
import { editEmoji } from "./editEmoji";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function emojis<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  createEmoji(bot);
  deleteEmoji(bot);
  editEmoji(bot);
}
