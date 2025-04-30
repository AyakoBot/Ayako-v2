/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 type GatewayChannelCreateDispatchData,
 type GatewayChannelDeleteDispatchData,
 type GatewayChannelPinsUpdateDispatchData,
 type GatewayChannelUpdateDispatchData,
} from 'discord.js';
import RedisClient, { cache as redis } from '../../../../BaseClient/Bot/Redis.js';

export default {
 [GatewayDispatchEvents.ChannelCreate]: (data: GatewayChannelCreateDispatchData) =>
  redis.channels.set(data),

 [GatewayDispatchEvents.ChannelDelete]: async (data: GatewayChannelDeleteDispatchData) => {
  redis.channels.del(data.id);

  const pipeline = RedisClient.pipeline();
  const messages = await RedisClient.hgetall(redis.messages.keystore(data.guild_id));

  pipeline.hdel(
   redis.messages.keystore(data.guild_id),
   ...Object.keys(messages).filter((m) => m.includes(data.id)),
  );
  pipeline.del(...Object.keys(messages).filter((m) => m.includes(data.id)));
  pipeline.exec();
 },

 [GatewayDispatchEvents.ChannelPinsUpdate]: (_: GatewayChannelPinsUpdateDispatchData) => undefined,

 [GatewayDispatchEvents.ChannelUpdate]: (data: GatewayChannelUpdateDispatchData) =>
  redis.channels.set(data),
} as const;
