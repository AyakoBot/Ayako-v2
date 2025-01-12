/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 type GatewayIntegrationCreateDispatchData,
 type GatewayIntegrationDeleteDispatchData,
 type GatewayIntegrationUpdateDispatchData,
} from 'discord.js';
import { cache as redis } from '../../../../BaseClient/Bot/Redis.js';

export default {
 [GatewayDispatchEvents.IntegrationCreate]: (data: GatewayIntegrationCreateDispatchData) =>
  redis.integrations.set(data, data.guild_id),

 [GatewayDispatchEvents.IntegrationDelete]: (data: GatewayIntegrationDeleteDispatchData) =>
  redis.integrations.del(data.id),

 [GatewayDispatchEvents.IntegrationUpdate]: (data: GatewayIntegrationUpdateDispatchData) =>
  redis.integrations.set(data, data.guild_id),
} as const;
