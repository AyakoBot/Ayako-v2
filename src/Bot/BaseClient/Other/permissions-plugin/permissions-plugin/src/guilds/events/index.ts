import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { createScheduledEvent } from "./createScheduledEvent";
import { editScheduledEvent } from "./editScheduledEvent";

export function events<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  createScheduledEvent(bot);
  editScheduledEvent(bot);
}
