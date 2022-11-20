
import { editWidgetSettings } from "./editWidgetSettings";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
export function widgets<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  editWidgetSettings(bot);
}
