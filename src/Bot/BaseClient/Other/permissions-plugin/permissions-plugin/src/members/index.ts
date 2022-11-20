
import { banMember } from "./banMember";
import { editBotMember } from "./editBotMember";
import { editMember } from "./editMember";
import { kickMember } from "./kickMember";
import { pruneMembers } from "./pruneMembers";
import { unbanMember } from "./unbanMember";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function members<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  banMember(bot);
  editBotMember(bot);
  editMember(bot);
  kickMember(bot);
  pruneMembers(bot);
  unbanMember(bot);
}
