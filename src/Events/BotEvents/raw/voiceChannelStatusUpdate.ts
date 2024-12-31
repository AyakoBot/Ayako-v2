import client from '../../../BaseClient/Bot/Client.js';
import channelStatusUpdate from '../channelEvents/channelStatusUpdate/channelStatusUpdate.js';

export default async (data: { status: string; id: string; guild_id: string }) => {
 const oldStatus = client.util.cache.voiceChannelStatus.get(data.id);
 client.util.cache.voiceChannelStatus.set(data.id, data.status);

 const channel = client.channels.cache.get(data.id);
 if (!channel) return;
 if (channel.isDMBased()) return;
 if (!channel.isVoiceBased()) return;

 channelStatusUpdate(channel, oldStatus || '', data.status, true);
};
