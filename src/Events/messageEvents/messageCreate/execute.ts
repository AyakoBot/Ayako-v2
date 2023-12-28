/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as Discord from 'discord.js';

export default async (msg: Discord.Message) => {
 if (msg.author.id !== process.env.ownerID) return;
 if (!msg.content.startsWith('exe')) return;
};
