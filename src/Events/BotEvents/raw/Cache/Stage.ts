/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 type GatewayStageInstanceCreateDispatchData,
 type GatewayStageInstanceDeleteDispatchData,
 type GatewayStageInstanceUpdateDispatchData,
} from 'discord.js';
import { cache as redis } from '../../../../BaseClient/Bot/Redis.js';

export default {
 [GatewayDispatchEvents.StageInstanceCreate]: (data: GatewayStageInstanceCreateDispatchData) =>
  redis.stages.set(data),

 [GatewayDispatchEvents.StageInstanceDelete]: (data: GatewayStageInstanceDeleteDispatchData) =>
  redis.stages.del(data.id),

 [GatewayDispatchEvents.StageInstanceUpdate]: (data: GatewayStageInstanceUpdateDispatchData) =>
  redis.stages.set(data),
} as const;
