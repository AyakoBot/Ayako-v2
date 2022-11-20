import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { createAutomodRule } from "./createAutomodRule";
import { deleteAutomodRule } from "./deleteAutomodRule";
import { editAutomodRule } from "./editAutomodRule";
import { getAutomodRule } from "./getAutomodRule";
import { getAutomodRules } from "./getAutomodRules";

export function automod<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  createAutomodRule(bot);
  deleteAutomodRule(bot);
  editAutomodRule(bot);
  getAutomodRule(bot);
  getAutomodRules(bot);
}
