
import { addReaction } from "./addReaction";
import { addReactions } from "./addReactions";
import { deleteReactionsAll } from "./deleteReactionsAll";
import { deleteReactionsEmoji } from "./deleteReactionsEmoji";
import { deleteUserReaction } from "./deleteUserReaction.ts";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
export function reactions<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  addReaction(bot);
  addReactions(bot);
  deleteReactionsAll(bot);
  deleteReactionsEmoji(bot);
  deleteUserReaction(bot);
}
