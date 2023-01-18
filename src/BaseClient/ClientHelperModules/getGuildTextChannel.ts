import client from '../Client.js';

export default async (channelId: string) => {
  const channel = await client.channels
    .fetch(channelId, { allowUnknownGuild: true })
    .catch(() => undefined);

  if (!channel) return undefined;
  if (!channel.isTextBased()) return undefined;
  if (channel.isDMBased()) return undefined;
  return channel;
};
