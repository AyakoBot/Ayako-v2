
import { createWebhook } from "./createWebhook";
import { deleteWebhook } from "./deleteWebhook";
import { editWebhook } from "./editWebhook";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
import { Bot } from "discordeno";

export function webhooks<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  createWebhook(bot);
  deleteWebhook(bot);
  editWebhook(bot);
}
