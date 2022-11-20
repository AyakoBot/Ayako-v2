
import { createEmoji } from "./createEmoji";
import { deleteEmoji } from "./deleteEmoji";
import { editEmoji } from "./editEmoji";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function emojis<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  createEmoji(bot);
  deleteEmoji(bot);
  editEmoji(bot);
}
