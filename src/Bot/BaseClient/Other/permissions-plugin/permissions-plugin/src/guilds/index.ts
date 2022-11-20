
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
import { automod } from "./automod";
import { createGuild } from "./createGuild";
import { deleteGuild } from "./deleteGuild";
import { editGuild } from "./editGuild";
import { editGuildMfaLevel } from "./editGuildMfaLevel";
import { editWelcomeScreen } from "./editWelcomeScreen";
import { events } from "./events";
import { getAuditLog } from "./getAuditLog";
import { getBan } from "./getBan";
import { getBans } from "./getBans";
import { getPruneCount } from "./getPruneCount";
import { getVanityUrl } from "./getVanityUrl";
import { getWelcomeScreen } from "./getWelcomeScreen";
import { voice } from "./voice";
import { widgets } from "./widgets";

export function guilds<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  automod(bot);
  events(bot);
  voice(bot);
  widgets(bot);

  createGuild(bot);
  deleteGuild(bot);
  editGuild(bot);
  editGuildMfaLevel(bot);
  editWelcomeScreen(bot);
  getAuditLog(bot);
  getBan(bot);
  getBans(bot);
  getPruneCount(bot);
  getVanityUrl(bot);
  getWelcomeScreen(bot);
}
