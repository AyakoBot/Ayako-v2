
import { deleteIntegration } from "./deleteIntegrations";
import { getIntegrations } from "./getIntegrations";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function integrations<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  deleteIntegration(bot);
  getIntegrations(bot);
}
