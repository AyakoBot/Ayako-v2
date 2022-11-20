
import { addRole } from "./addRole";
import { createRole } from "./createRole";
import { deleteRole } from "./deleteRole";
import { editRole } from "./editRole";
import { modifyRolePositions } from "./modifyRolePositions";
import { removeRole } from "./removeRole";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function roles<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  addRole(bot);
  createRole(bot);
  deleteRole(bot);
  editRole(bot);
  modifyRolePositions(bot);
  removeRole(bot);
}
