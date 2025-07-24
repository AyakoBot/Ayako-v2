import type { Channel } from 'discord.js';

export default async (channel: Channel) => {
 channel.client.util.DataBase.welcomeGIF.deleteMany({ where: { channelId: channel.id } }).then();
};
