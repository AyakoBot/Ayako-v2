import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
import { addThreadMember } from "./addThreadMember";
import { getPrivateArchivedThreads } from "./getPrivateArchivedThreads";
import { getPrivateJoinedArchivedThreads } from "./getPrivateJoinedArchivedThreads";
import { getPublicArchivedThreads } from "./getPublicArchivedThreads";
import { joinThread } from "./joinThread";
import { leaveThread } from "./leaveThread";
import { removeThreadMember } from "./removeThreadMember";

export function threads<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  addThreadMember(bot);
  getPublicArchivedThreads(bot);
  getPrivateArchivedThreads(bot);
  getPrivateJoinedArchivedThreads(bot);
  joinThread(bot);
  leaveThread(bot);
  removeThreadMember(bot);
}
