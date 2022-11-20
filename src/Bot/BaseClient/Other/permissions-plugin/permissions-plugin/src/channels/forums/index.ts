import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { createForumThread } from "./createForumThread";

export function forums<B extends Bot>(bot: BotWithProxyCache<ProxyCacheTypes, B>) {
  createForumThread(bot);
}
