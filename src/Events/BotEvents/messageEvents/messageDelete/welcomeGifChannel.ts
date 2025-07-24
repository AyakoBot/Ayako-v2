import type { Message } from 'discord.js';

export default async (msg: Message<true>) => {
 msg.client.util.DataBase.welcomeGIF.delete({ where: { msgId: msg.id } }).then();
};
