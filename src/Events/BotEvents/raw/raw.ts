import { GatewayDispatchEvents, GatewayOpcodes, type GatewayDispatchPayload } from 'discord.js';
import channelStatuses from './channelStatuses.js';
// import cache from './cache.js';
import voiceChannelStatusUpdate from './voiceChannelStatusUpdate.js';

export default (data: GatewayDispatchPayload) => {
 if (data.op !== GatewayOpcodes.Dispatch) return;
 // cache(data);

 switch (data.t) {
  // TODO: wait for d to document this
  case 'VOICE_CHANNEL_STATUS_UPDATE' as GatewayDispatchEvents:
   voiceChannelStatusUpdate(data.d as unknown as Parameters<typeof voiceChannelStatusUpdate>[0]);
   break;
  // TODO: wait for d to document this
  case 'CHANNEL_STATUSES' as GatewayDispatchEvents:
   channelStatuses(data.d as unknown as Parameters<typeof channelStatuses>[0]);
   break;
  default:
   break;
 }
};
