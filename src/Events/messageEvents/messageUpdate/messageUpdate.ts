import type * as Discord from 'discord.js';
import commandHandler from '../messageCreate/commandHandler.js';
import log from './log.js';

export default async (oldMsg: Discord.Message, msg: Discord.Message) => {
 if (!msg.inGuild()) return;

 log(oldMsg, msg);
 commandHandler(msg);
};
