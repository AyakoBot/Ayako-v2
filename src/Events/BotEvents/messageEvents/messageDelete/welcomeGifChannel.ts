import type { Message } from 'discord.js';

export default async (msg: Message<true>) => {
 msg.client.util.DataBase.welcomeGIF.deleteMany({ where: { msgId: msg.id } }).then();
};
