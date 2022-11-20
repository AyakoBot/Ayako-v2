
import { createChannel } from "./createChannel";
import { deleteChannel } from "./deleteChannel";
import { deleteChannelPermissionOverride } from "./deleteChannelPermissionOverride";
import { editChannel } from "./editChannel";
import { editChannelPermissionOverrides } from "./editChannelPermissionOverrides";
import { followAnnouncementChannel } from "./followAnnouncementChannel";
import { forums } from "./forums";
import { getChannelWebhooks } from "./getChannelWebhooks";
import { stages } from "./stages";
import { swapChannels } from "./swapChannels";
import { threads } from "./threads";
import type { Bot } from "discordeno";
import type { BotWithProxyCache, ProxyCacheTypes } from "../../..";
export function channels<B extends Bot>(
    bot: BotWithProxyCache<ProxyCacheTypes, B>
  ) {
  forums(bot);
  stages(bot);
  threads(bot);

  createChannel(bot);
  deleteChannel(bot);
  deleteChannelPermissionOverride(bot);
  editChannel(bot);
  editChannelPermissionOverrides(bot);
  followAnnouncementChannel(bot);
  getChannelWebhooks(bot);
  swapChannels(bot);
}
