import * as Discord from 'discord.js';
import * as getChannel from './getChannel.js';

export default async (link: string): Promise<Discord.Message | undefined> => {
 const [, , , , guildID, channelID, messageID] = link.split('/');

 const client = await import('../Client.js').then((m) => m.default);

 const guild = client.guilds.cache.get(guildID);
 if (!guild) return undefined;

 const channel = await getChannel.guildTextChannel(channelID);
 if (!channel) return undefined;

 return channel.messages.fetch(messageID).catch(() => undefined);
};
