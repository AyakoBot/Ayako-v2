import client from '../../../BaseClient/Bot/Client.js';

export default async (data: { status: string; id: string; guild_id: string }) => {
 client.util.cache.voiceChannelStatus.set(data.id, data.status);
};
