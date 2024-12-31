import voiceChannelStatusUpdate from './voiceChannelStatusUpdate.js';

export default async (data: { guild_id: string; channels: { status: string; id: string }[] }) => {
 data.channels.forEach((c) =>
  voiceChannelStatusUpdate({ status: c.status, id: c.id, guild_id: data.guild_id }),
 );
};
