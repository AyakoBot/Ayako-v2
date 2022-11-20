
import { deleteIntegration } from "./deleteIntegrations";
import { getIntegrations } from "./getIntegrations";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function integrations<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  deleteIntegration(bot);
  getIntegrations(bot);
}
