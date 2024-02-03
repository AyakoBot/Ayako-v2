import * as Discord from 'discord.js';

/**
 * Retrieves a Discord message from a given link.
 * @param link - The link to the message.
 * @returns The Discord message if found, otherwise undefined.
 */
export default async (link: string): Promise<Discord.Message | undefined> => {
 const [, , , , guildId, channelId, messageId] = link.split('/');

 const client = await import('../Bot/Client.js').then((m) => m.default);

 const guild = client.guilds.cache.get(guildId);
 if (!guild) return undefined;

 const channel = await client.util.getChannel.guildTextChannel(channelId);
 if (!channel) return undefined;

 /**
  * Retrieves the message from the channel.
  * @returns The Discord message if found, otherwise undefined.
  */
 const getMessage = async () => {
  const m = await client.util.request.channels.getMessage(channel, messageId);
  if ('message' in m) return undefined;

  return m;
 };

 const message = channel.messages.cache.get(messageId) ?? (await getMessage());
 if (!message) return message;
 if (!message.author || message.partial) {
  const m = await client.util.request.channels.getMessage(message.channel, message.id);
  if ('message' in m) return undefined;
  return m;
 }
 return message;
};
