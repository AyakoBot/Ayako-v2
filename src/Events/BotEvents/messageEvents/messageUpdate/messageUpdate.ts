import type * as Discord from 'discord.js';

import commandHandler from '../messageCreate/commandHandler.js';
import dmLog from '../messageCreate/dmLog.js';
import log from './log.js';

export default async (oldMsg: Discord.Message, msg: Discord.Message) => {
 if (!msg.inGuild()) {
  dmLog(msg);
  return;
 }

 log(oldMsg, msg);
 commandHandler(msg);
};
