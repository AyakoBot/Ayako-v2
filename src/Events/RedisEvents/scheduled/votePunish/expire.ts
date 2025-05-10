import type { GuildTextBasedChannel, OverwriteType } from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';

export default async (payload: {
 guildId: string;
 channelId: string;
 id: string;
 overwrites: {
  type: OverwriteType;
  id: string;
  allow: string;
  deny: string;
 }[];
}) => {
 const guild = client.guilds.cache.get(payload.guildId);
 if (!guild) return;

 const channel = guild.channels.cache.get(payload.channelId) as GuildTextBasedChannel;
 if (!channel) return;

 const message = await client.util.request.channels.getMessage(channel, payload.id);
 if (!('message' in message)) client.util.request.channels.deleteMessage(message);

 await client.util.request.channels.edit((channel.isThread() ? channel.parent : channel)!, {
  permission_overwrites: payload.overwrites,
 });
};
