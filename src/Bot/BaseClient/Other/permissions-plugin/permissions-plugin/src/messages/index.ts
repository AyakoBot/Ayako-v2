
import { deleteMessage } from "./deleteMessage";
import { deleteMessages } from "./deleteMessages";
import { getMessage } from "./getMessage";
import { getMessages } from "./getMessages";
import { pinMessage } from "./pinMessage";
import { reactions } from "./reactions";
import { sendMessage } from "./sendMessage";
import { unpinMessage } from "./unpinMessage";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function messages<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  reactions(bot);
  deleteMessage(bot);
  deleteMessages(bot);
  getMessage(bot);
  getMessages(bot);
  pinMessage(bot);
  sendMessage(bot);
  unpinMessage(bot);
}
