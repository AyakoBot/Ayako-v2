/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 type GatewayChannelCreateDispatchData,
 type GatewayChannelDeleteDispatchData,
 type GatewayChannelPinsUpdateDispatchData,
 type GatewayChannelUpdateDispatchData,
} from 'discord.js';
import RedisClient, { cache as redis } from '../../../../BaseClient/Bot/Redis.js';
import scanKeys from '../../../../BaseClient/UtilModules/scanKeys.js';

export default {
 [GatewayDispatchEvents.ChannelCreate]: (data: GatewayChannelCreateDispatchData) =>
  redis.channels.set(data),

 [GatewayDispatchEvents.ChannelDelete]: (data: GatewayChannelDeleteDispatchData) => {
  redis.channels.del(data.id);
  scanKeys(`${redis.messages.key()}:${data.guild_id}:${data.id}:*`).then((keys) =>
   keys.length ? RedisClient.del(keys) : 0,
  );
 },

 [GatewayDispatchEvents.ChannelPinsUpdate]: (_: GatewayChannelPinsUpdateDispatchData) => undefined,

 [GatewayDispatchEvents.ChannelUpdate]: (data: GatewayChannelUpdateDispatchData) =>
  redis.channels.set(data),
} as const;
