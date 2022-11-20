
import { connectToVoiceChannel } from "./connectToVoiceChannels";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
export function voice<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  connectToVoiceChannel(bot);
}
