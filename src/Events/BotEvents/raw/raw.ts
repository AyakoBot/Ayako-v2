import voiceChannelStatusUpdate from './voiceChannelStatusUpdate.js';
import channelStatuses from './channelStatuses.js';

export default (data: { t: string; s: number; op: number; d: unknown }) => {
 switch (data.t) {
  case 'VOICE_CHANNEL_STATUS_UPDATE':
   voiceChannelStatusUpdate(data.d as Parameters<typeof voiceChannelStatusUpdate>[0]);
   break;
  case 'CHANNEL_STATUSES':
   channelStatuses(data.d as Parameters<typeof channelStatuses>[0]);
   break;
  default:
   break;
 }
};
