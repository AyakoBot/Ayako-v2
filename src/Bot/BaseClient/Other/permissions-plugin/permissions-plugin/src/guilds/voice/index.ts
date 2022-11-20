
import { connectToVoiceChannel } from "./connectToVoiceChannels";
import { Bot } from "discordeno";
import { BotWithProxyCache, ProxyCacheTypes } from "../../../..";
export function voice<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  connectToVoiceChannel(bot);
}
