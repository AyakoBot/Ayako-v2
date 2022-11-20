
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { createStageInstance } from "./createStageInstance";
import { deleteStageInstance } from "./deleteStageInstances";
import { editStageInstance } from "./editStageInstance";

export function stages<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  createStageInstance(bot);
  deleteStageInstance(bot);
  editStageInstance(bot);
}
