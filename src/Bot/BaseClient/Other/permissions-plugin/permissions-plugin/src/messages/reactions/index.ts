
import { addReaction } from "./addReaction";
import { addReactions } from "./addReactions";
import { deleteReactionsAll } from "./deleteReactionsAll";
import { deleteReactionsEmoji } from "./deleteReactionsEmoji";
import { deleteUserReaction } from "./deleteUserReaction.ts";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
export function reactions<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  addReaction(bot);
  addReactions(bot);
  deleteReactionsAll(bot);
  deleteReactionsEmoji(bot);
  deleteUserReaction(bot);
}
