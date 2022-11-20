
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "..";
import { channels } from "./src/channels";
import { emojis } from "./src/emojis";
import { guilds } from "./src/guilds";
import { integrations } from "./src/integrations";
import { members } from "./src/members";
import { messages } from "./src/messages";
import { roles } from "./src/roles";
import { stickers } from "./src/stickers";
import { webhooks } from "./src/webhooks";

// PLUGINS MUST TAKE A BOT ARGUMENT WHICH WILL BE MODIFIED
export function enablePermissionsPlugin<B extends Bot>(
  bot: BotWithProxyCache<ProxyCacheTypes, B>
) {
  // PERM CHECKS REQUIRE CACHE DUH!
  if (!bot.enabledPlugins?.has("PROXY_CACHE")) throw new Error("The PERMISSIONS plugin requires the PROXY_CACHE plugin first.");

  // MARK THIS PLUGIN BEING USED
  bot.enabledPlugins.add("PERMISSIONS");

  // BEGIN OVERRIDING HELPER FUNCTIONS
  channels(bot);
  emojis(bot);
  guilds(bot);
  integrations(bot);
  members(bot);
  messages(bot);
  roles(bot);
  stickers(bot);
  webhooks(bot);

  // PLUGINS MUST RETURN THE BOT
  return bot;
}

export * from "./src/permissions";
// DEFAULT MAKES IT SLIGHTLY EASIER TO USE
export default enablePermissionsPlugin;
