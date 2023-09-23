import * as Discord from 'discord.js';
import * as getChannel from './getChannel.js';
import { request } from './requestHandler.js';

/**
 * Retrieves a Discord message from a given link.
 * @param link - The link to the message.
 * @returns The Discord message if found, otherwise undefined.
 */
export default async (link: string): Promise<Discord.Message | undefined> => {
 const [, , , , guildId, channelId, messageId] = link.split('/');

 const client = await import('../Client.js').then((m) => m.default);

 const guild = client.guilds.cache.get(guildId);
 if (!guild) return undefined;

 const channel = await getChannel.guildTextChannel(channelId);
 if (!channel) return undefined;

 /**
  * Retrieves the message from the channel.
  * @returns The Discord message if found, otherwise undefined.
  */
 const getMessage = async () => {
  const m = await request.channels.getMessage(channel, messageId);
  if ('message' in m) return undefined;

  return m;
 };

 return channel.messages.cache.get(messageId) ?? getMessage();
};
