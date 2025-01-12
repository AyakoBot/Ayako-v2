/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 type GatewaySubscriptionCreateDispatchData,
 type GatewaySubscriptionDeleteDispatchData,
 type GatewaySubscriptionUpdateDispatchData,
} from 'discord.js';

export default {
 [GatewayDispatchEvents.SubscriptionCreate]: (_: GatewaySubscriptionCreateDispatchData) =>
  undefined,

 [GatewayDispatchEvents.SubscriptionDelete]: (_: GatewaySubscriptionDeleteDispatchData) =>
  undefined,

 [GatewayDispatchEvents.SubscriptionUpdate]: (_: GatewaySubscriptionUpdateDispatchData) =>
  undefined,
} as const;
