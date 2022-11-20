
import { editWidgetSettings } from "./editWidgetSettings";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
export function widgets<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  editWidgetSettings(bot);
}
