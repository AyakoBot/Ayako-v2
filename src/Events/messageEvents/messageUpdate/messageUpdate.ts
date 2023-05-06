import type * as Discord from 'discord.js';
import log from './log.js';

export default async (oldMsg: Discord.Message, msg: Discord.Message) => {
 log(oldMsg, msg);
};
